using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AppointmentSystem.Data;
using AppointmentSystem.Models;
using AppointmentSystem.DTOs;

namespace AppointmentSystem.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppointmentDbContext _context;

    public AdminController(AppointmentDbContext context)
    {
        _context = context;
    }

    // GET: api/admin/appointments
    [HttpGet("appointments")]
    public async Task<ActionResult<IEnumerable<AppointmentDetailDto>>> GetAllAppointments(
        [FromQuery] DateTime? dateFrom,
        [FromQuery] DateTime? dateTo,
        [FromQuery] int? serviceId,
        [FromQuery] string? status)
    {
        var query = _context.Appointments
            .Include(a => a.Customer)
            .Include(a => a.Service)
            .AsQueryable();

        // Apply filters
        if (dateFrom.HasValue)
        {
            query = query.Where(a => a.StartTime >= dateFrom.Value);
        }

        if (dateTo.HasValue)
        {
            query = query.Where(a => a.StartTime <= dateTo.Value);
        }

        if (serviceId.HasValue)
        {
            query = query.Where(a => a.ServiceId == serviceId.Value);
        }

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<AppointmentStatus>(status, true, out var statusEnum))
        {
            query = query.Where(a => a.Status == statusEnum);
        }

        var appointments = await query
            .Select(a => new AppointmentDetailDto
            {
                Id = a.Id,
                CustomerId = a.CustomerId,
                CustomerName = a.Customer.FullName,
                CustomerEmail = a.Customer.Email,
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

    // PUT: api/admin/appointments/{id}/approve
    [HttpPut("appointments/{id}/approve")]
    public async Task<ActionResult<AppointmentDto>> ApproveAppointment(int id)
    {
        var appointment = await _context.Appointments
            .Include(a => a.Service)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (appointment == null)
        {
            return NotFound();
        }

        appointment.Status = AppointmentStatus.Approved;
        appointment.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var appointmentDto = new AppointmentDto
        {
            Id = appointment.Id,
            ServiceId = appointment.ServiceId,
            ServiceName = appointment.Service.Name,
            StartTime = appointment.StartTime,
            EndTime = appointment.EndTime,
            Status = appointment.Status.ToString()
        };

        return Ok(appointmentDto);
    }

    // PUT: api/admin/appointments/{id}/reject
    [HttpPut("appointments/{id}/reject")]
    public async Task<IActionResult> RejectAppointment(int id, [FromBody] RejectAppointmentDto dto)
    {
        var appointment = await _context.Appointments.FindAsync(id);

        if (appointment == null)
        {
            return NotFound();
        }

        appointment.Status = AppointmentStatus.Rejected;
        appointment.AdminNote = dto.AdminNote;
        appointment.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/admin/appointments/{id}
    [HttpDelete("appointments/{id}")]
    public async Task<IActionResult> DeleteAppointment(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);

        if (appointment == null)
        {
            return NotFound();
        }

        _context.Appointments.Remove(appointment);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
