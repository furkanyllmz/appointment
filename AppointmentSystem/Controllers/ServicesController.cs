using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AppointmentSystem.Data;
using AppointmentSystem.Models;
using AppointmentSystem.DTOs;

namespace AppointmentSystem.Controllers;

[ApiController]
[Route("api/services")]
[Authorize]
public class ServicesController : ControllerBase
{
    private readonly AppointmentDbContext _context;

    public ServicesController(AppointmentDbContext context)
    {
        _context = context;
    }

    // GET: api/services
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServices()
    {
        var services = await _context.Services
            .Where(s => s.IsActive)
            .Select(s => new ServiceDto
            {
                Id = s.Id,
                Name = s.Name,
                DurationMin = s.DurationMin,
                Price = s.Price,
                IsActive = s.IsActive
            })
            .ToListAsync();

        return Ok(services);
    }

    // POST: api/services
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ServiceDto>> CreateService(CreateServiceDto dto)
    {
        var service = new Service
        {
            Name = dto.Name,
            DurationMin = dto.DurationMin,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Services.Add(service);
        await _context.SaveChangesAsync();

        var serviceDto = new ServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            DurationMin = service.DurationMin,
            Price = service.Price,
            IsActive = service.IsActive
        };

        return CreatedAtAction(nameof(GetServices), new { id = service.Id }, serviceDto);
    }

    // PUT: api/services/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateService(int id, UpdateServiceDto dto)
    {
        var service = await _context.Services.FindAsync(id);

        if (service == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(dto.Name))
        {
            service.Name = dto.Name;
        }

        if (dto.DurationMin.HasValue)
        {
            service.DurationMin = dto.DurationMin.Value;
        }

        if (dto.Price.HasValue)
        {
            service.Price = dto.Price.Value;
        }

        if (dto.IsActive.HasValue)
        {
            service.IsActive = dto.IsActive.Value;
        }

        service.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
