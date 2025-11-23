using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppointmentSystem.Data;
using AppointmentSystem.Models;
using AppointmentSystem.DTOs;
using AppointmentSystem.Services;
using System.Security.Claims;

namespace AppointmentSystem.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppointmentDbContext _context;
    private readonly IAuthService _authService;

    public AuthController(AppointmentDbContext context, IAuthService authService)
    {
        _context = context;
        _authService = authService;
    }

    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto dto)
    {
        // Check if email already exists
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest(new { message = "Email already registered" });
        }

        // Determine role based on dto.Role (default to Customer)
        UserRole userRole = UserRole.Customer;
        if (!string.IsNullOrEmpty(dto.Role))
        {
            if (dto.Role.Equals("Admin", StringComparison.OrdinalIgnoreCase) || 
                dto.Role.Equals("Business", StringComparison.OrdinalIgnoreCase))
            {
                userRole = UserRole.Admin;
            }
        }

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = _authService.HashPassword(dto.Password),
            Role = userRole,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var userDto = new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString()
        };

        return CreatedAtAction(nameof(GetMe), userDto);
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null || !_authService.VerifyPassword(dto.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        var token = _authService.GenerateJwtToken(user);

        var response = new AuthResponseDto
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString()
            }
        };

        return Ok(response);
    }

    // GET: api/auth/me
    [HttpGet("me")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<ActionResult<UserDto>> GetMe()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        var user = await _context.Users.FindAsync(userId);
        
        if (user == null)
        {
            return NotFound();
        }

        var userDto = new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString()
        };

        return Ok(userDto);
    }
}
