using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AppointmentSystem.Data;
using AppointmentSystem.Models;

namespace AppointmentSystem.Controllers;

[ApiController]
[Route("api/admin/settings")]
[Authorize(Roles = "Admin")]
public class BusinessSettingsController : ControllerBase
{
    private readonly AppointmentDbContext _context;

    public BusinessSettingsController(AppointmentDbContext context)
    {
        _context = context;
    }

    // GET: api/admin/settings
    [HttpGet]
    public async Task<ActionResult<BusinessSettings>> GetSettings()
    {
        var settings = await _context.BusinessSettings.FirstOrDefaultAsync();
        
        if (settings == null)
        {
            return NotFound(new { message = "Business settings not found" });
        }

        return Ok(settings);
    }

    // PUT: api/admin/settings
    [HttpPut]
    public async Task<IActionResult> UpdateSettings(BusinessSettings dto)
    {
        var settings = await _context.BusinessSettings.FirstOrDefaultAsync();

        if (settings == null)
        {
            return NotFound();
        }

        settings.BusinessName = dto.BusinessName;
        settings.BusinessType = dto.BusinessType;
        settings.Address = dto.Address;
        settings.Phone = dto.Phone;
        settings.Email = dto.Email;
        settings.SlotDurationMinutes = dto.SlotDurationMinutes;
        settings.BufferTimeMinutes = dto.BufferTimeMinutes;
        settings.AllowSameDayBooking = dto.AllowSameDayBooking;
        settings.MaxAdvanceBookingDays = dto.MaxAdvanceBookingDays;
        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
