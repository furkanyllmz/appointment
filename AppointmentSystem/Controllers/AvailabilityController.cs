using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AppointmentSystem.Data;
using AppointmentSystem.Models;

namespace AppointmentSystem.Controllers;

[ApiController]
[Route("api/availability")]
[Authorize]
public class AvailabilityController : ControllerBase
{
    private readonly AppointmentDbContext _context;

    public AvailabilityController(AppointmentDbContext context)
    {
        _context = context;
    }

    // GET: api/availability?date=2025-11-05&serviceId=1
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TimeSlot>>> GetAvailableSlots(
        [FromQuery] DateTime date,
        [FromQuery] int serviceId)
    {
        // Servisi kontrol et
        var service = await _context.Services.FindAsync(serviceId);
        if (service == null || !service.IsActive)
        {
            return BadRequest(new { message = "Service not found or inactive" });
        }

        // Gün adını al
        var dayOfWeek = (DayOfWeekEnum)((int)date.DayOfWeek);

        // Çalışma saatlerini kontrol et
        var workingHours = await _context.WorkingHours
            .FirstOrDefaultAsync(w => w.DayOfWeek == dayOfWeek);

        if (workingHours == null || !workingHours.IsOpen)
        {
            return Ok(new List<TimeSlot>()); // Kapalı gün
        }

        // Ara dinlenme saatlerini al
        var breakTimes = await _context.BreakTimes
            .Where(b => b.DayOfWeek == dayOfWeek)
            .ToListAsync();

        // İşletme ayarlarını al
        var settings = await _context.BusinessSettings.FirstOrDefaultAsync();
        if (settings == null)
        {
            return BadRequest(new { message = "Business settings not configured" });
        }

        // O gün için mevcut randevuları al
        var dateOnly = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);
        var existingAppointments = await _context.Appointments
            .Where(a => a.StartTime.Date == dateOnly && 
                       a.Status != AppointmentStatus.Cancelled &&
                       a.Status != AppointmentStatus.Rejected)
            .ToListAsync();

        // Müsait saatleri oluştur
        var availableSlots = new List<TimeSlot>();
        var currentTime = new DateTime(date.Year, date.Month, date.Day, 
            workingHours.OpenTime.Hours, workingHours.OpenTime.Minutes, 0);
        var closeTime = new DateTime(date.Year, date.Month, date.Day, 
            workingHours.CloseTime.Hours, workingHours.CloseTime.Minutes, 0);

        while (currentTime.AddMinutes(service.DurationMin) <= closeTime)
        {
            var slotEndTime = currentTime.AddMinutes(service.DurationMin);

            // Ara dinlenme kontrolü
            bool isBreakTime = breakTimes.Any(b =>
            {
                var breakStart = new DateTime(date.Year, date.Month, date.Day, b.StartTime.Hours, b.StartTime.Minutes, 0);
                var breakEnd = new DateTime(date.Year, date.Month, date.Day, b.EndTime.Hours, b.EndTime.Minutes, 0);
                return currentTime < breakEnd && slotEndTime > breakStart;
            });

            // Mevcut randevu kontrolü
            bool isBooked = existingAppointments.Any(a =>
                currentTime < a.EndTime && slotEndTime > a.StartTime);

            // Geçmiş zaman kontrolü
            bool isPast = currentTime < DateTime.Now;

            if (!isBreakTime && !isBooked && !isPast)
            {
                availableSlots.Add(new TimeSlot
                {
                    StartTime = currentTime.ToString("HH:mm"),
                    EndTime = slotEndTime.ToString("HH:mm"),
                    IsAvailable = true
                });
            }

            currentTime = currentTime.AddMinutes(settings.SlotDurationMinutes + settings.BufferTimeMinutes);
        }

        return Ok(availableSlots);
    }
}

public class TimeSlot
{
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }
}
