using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppointmentSystem.Data;
using AppointmentSystem.DTOs;

namespace AppointmentSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BusinessesController : ControllerBase
{
    private readonly AppointmentDbContext _context;

    public BusinessesController(AppointmentDbContext context)
    {
        _context = context;
    }

    // GET: api/businesses
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BusinessDto>>> GetBusinesses()
    {
        var settings = await _context.BusinessSettings.FirstOrDefaultAsync();
        
        if (settings == null)
        {
            return Ok(new List<BusinessDto>());
        }

        var businesses = new List<BusinessDto>
        {
            new BusinessDto
            {
                Id = settings.Id,
                Name = settings.BusinessName,
                Type = settings.BusinessType,
                Address = settings.Address,
                Phone = settings.Phone,
                Email = settings.Email
            }
        };

        return Ok(businesses);
    }

    // GET: api/businesses/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<BusinessDto>> GetBusiness(int id)
    {
        var settings = await _context.BusinessSettings.FindAsync(id);

        if (settings == null)
        {
            return NotFound();
        }

        var business = new BusinessDto
        {
            Id = settings.Id,
            Name = settings.BusinessName,
            Type = settings.BusinessType,
            Address = settings.Address,
            Phone = settings.Phone,
            Email = settings.Email
        };

        return Ok(business);
    }
}
