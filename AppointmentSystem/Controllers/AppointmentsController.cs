using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AppointmentSystem.Data;
using AppointmentSystem.Models;
using AppointmentSystem.DTOs;
using System.Security.Claims;

namespace AppointmentSystem.Controllers;

[ApiController]
[Route("api/appointments")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly AppointmentDbContext _context;

    public AppointmentsController(AppointmentDbContext context)
    {
        _context = context;
    }

    // POST: api/appointments
    [HttpPost]
    public async Task<ActionResult<AppointmentDto>> CreateAppointment(CreateAppointmentDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // Parse date and time
        if (!DateTime.TryParse(dto.AppointmentDate, out var appointmentDate))
        {
            return BadRequest(new { message = "Invalid date format" });
        }

        if (!TimeSpan.TryParse(dto.AppointmentTime, out var appointmentTime))
        {
            return BadRequest(new { message = "Invalid time format" });
        }

        // Yerel saat olarak DateTime oluştur (Unspecified), sonra UTC'ye çevir
        var localStartTime = new DateTime(
            appointmentDate.Year,
            appointmentDate.Month,
            appointmentDate.Day,
            appointmentTime.Hours,
            appointmentTime.Minutes,
            0,
            DateTimeKind.Unspecified
        );
        
        // Yerel saati UTC'ye çevir
        var startTime = DateTime.SpecifyKind(localStartTime, DateTimeKind.Utc);

        // Validate service exists and is active
        var service = await _context.Services.FindAsync(dto.ServiceId);
        if (service == null || !service.IsActive)
        {
            return BadRequest(new { message = "Service not found or inactive" });
        }

        // Calculate end time
        var endTime = startTime.AddMinutes(service.DurationMin);

        // Check for conflicts - Tüm DateTime'ları UTC'ye çevir
        var startTimeUtc = DateTime.SpecifyKind(startTime, DateTimeKind.Utc);
        var endTimeUtc = DateTime.SpecifyKind(endTime, DateTimeKind.Utc);
        
        // Aynı zaman diliminde başka randevu var mı kontrol et (servis fark etmez)
        var hasConflict = await _context.Appointments
            .AnyAsync(a => a.Status != AppointmentStatus.Cancelled &&
                          a.Status != AppointmentStatus.Rejected &&
                          ((startTimeUtc >= a.StartTime && startTimeUtc < a.EndTime) ||
                           (endTimeUtc > a.StartTime && endTimeUtc <= a.EndTime) ||
                           (startTimeUtc <= a.StartTime && endTimeUtc >= a.EndTime)));

        if (hasConflict)
        {
            return BadRequest(new { message = "Time slot not available" });
        }

        var appointment = new Appointment
        {
            CustomerId = userId,
            ServiceId = dto.ServiceId,
            StartTime = startTimeUtc,
            EndTime = endTimeUtc,
            Status = AppointmentStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        var appointmentDto = new AppointmentDto
        {
            Id = appointment.Id,
            ServiceId = appointment.ServiceId,
            ServiceName = service.Name,
            StartTime = appointment.StartTime,
            EndTime = appointment.EndTime,
            Status = appointment.Status.ToString()
        };

        return CreatedAtAction(nameof(GetUserAppointments), new { userId }, appointmentDto);
    }

    // GET: api/appointments/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetUserAppointments(int userId)
    {
        var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var userRole = User.FindFirst("role")?.Value ?? User.FindFirst(ClaimTypes.Role)?.Value;

        Console.WriteLine($"DEBUG: currentUserId={currentUserId}, userId={userId}, role={userRole}");

        // Users can only see their own appointments unless they're admin
        if (currentUserId != userId && userRole != "Admin")
        {
            return Forbid();
        }

        var appointments = await _context.Appointments
            .Include(a => a.Service)
            .Where(a => a.CustomerId == userId)
            .Select(a => new AppointmentDto
            {
                Id = a.Id,
                ServiceId = a.ServiceId,
                ServiceName = a.Service.Name,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                Status = a.Status.ToString(),
                AdminNote = a.AdminNote
            })
            .OrderByDescending(a => a.StartTime)
            .ToListAsync();

        return Ok(appointments);
    }

    // PUT: api/appointments/{id}/cancel
    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> CancelAppointment(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        var appointment = await _context.Appointments.FindAsync(id);

        if (appointment == null)
        {
            return NotFound();
        }

        // Only the customer who created it can cancel
        if (appointment.CustomerId != userId)
        {
            return Forbid();
        }

        appointment.Status = AppointmentStatus.Cancelled;
        appointment.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
