using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AppointmentSystem.Data;
using AppointmentSystem.Models;

namespace AppointmentSystem.Controllers;

[ApiController]
[Route("api/admin/working-hours")]
[Authorize(Roles = "Admin")]
public class WorkingHoursController : ControllerBase
{
    private readonly AppointmentDbContext _context;

    public WorkingHoursController(AppointmentDbContext context)
    {
        _context = context;
    }

    // GET: api/admin/working-hours
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkingHours>>> GetWorkingHours()
    {
        var hours = await _context.WorkingHours
            .OrderBy(w => w.DayOfWeek)
            .ToListAsync();

        return Ok(hours);
    }

    // PUT: api/admin/working-hours/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkingHours(int id, WorkingHours dto)
    {
        var hours = await _context.WorkingHours.FindAsync(id);

        if (hours == null)
        {
            return NotFound();
        }

        hours.IsOpen = dto.IsOpen;
        hours.OpenTime = dto.OpenTime;
        hours.CloseTime = dto.CloseTime;
        hours.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
