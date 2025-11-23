using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AppointmentSystem.Data;
using AppointmentSystem.Models;

namespace AppointmentSystem.Controllers;

[ApiController]
[Route("api/admin/break-times")]
[Authorize(Roles = "Admin")]
public class BreakTimesController : ControllerBase
{
    private readonly AppointmentDbContext _context;

    public BreakTimesController(AppointmentDbContext context)
    {
        _context = context;
    }

    // GET: api/admin/break-times
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BreakTime>>> GetBreakTimes()
    {
        var breaks = await _context.BreakTimes
            .OrderBy(b => b.DayOfWeek)
            .ThenBy(b => b.StartTime)
            .ToListAsync();

        return Ok(breaks);
    }

    // POST: api/admin/break-times
    [HttpPost]
    public async Task<ActionResult<BreakTime>> CreateBreakTime(BreakTime dto)
    {
        var breakTime = new BreakTime
        {
            DayOfWeek = dto.DayOfWeek,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.BreakTimes.Add(breakTime);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBreakTimes), new { id = breakTime.Id }, breakTime);
    }

    // DELETE: api/admin/break-times/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBreakTime(int id)
    {
        var breakTime = await _context.BreakTimes.FindAsync(id);
        
        if (breakTime == null)
        {
            return NotFound();
        }

        _context.BreakTimes.Remove(breakTime);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
