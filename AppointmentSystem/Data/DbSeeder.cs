using Microsoft.EntityFrameworkCore;
using AppointmentSystem.Models;
using AppointmentSystem.Services;

namespace AppointmentSystem.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppointmentDbContext context, IAuthService authService)
    {
        // Check if data exists
        if (await context.Users.AnyAsync())
        {
            return; // Database already seeded
        }

        // Create Admin user
        var admin = new User
        {
            FullName = "Admin",
            Email = "admin@appointment.com",
            PasswordHash = authService.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Users.Add(admin);

        // Create sample business accounts
        var businesses = new[]
        {
            new User
            {
                FullName = "Elit Kuaför",
                Email = "elit@kuafor.com",
                PasswordHash = authService.HashPassword("Business123!"),
                Role = UserRole.Admin,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                FullName = "Royal Barber",
                Email = "royal@barber.com",
                PasswordHash = authService.HashPassword("Business123!"),
                Role = UserRole.Admin,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Users.AddRange(businesses);

        // Create Customer users
        var customers = new[]
        {
            new User
            {
                FullName = "Ahmet Yılmaz",
                Email = "ahmet@test.com",
                PasswordHash = authService.HashPassword("Customer123!"),
                Role = UserRole.Customer,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                FullName = "Ayşe Demir",
                Email = "ayse@test.com",
                PasswordHash = authService.HashPassword("Customer123!"),
                Role = UserRole.Customer,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                FullName = "Mehmet Kaya",
                Email = "mehmet@test.com",
                PasswordHash = authService.HashPassword("Customer123!"),
                Role = UserRole.Customer,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Users.AddRange(customers);
        await context.SaveChangesAsync();

        // Create Services
        var services = new[]
        {
            new Service
            {
                Name = "Saç Kesimi",
                DurationMin = 30,
                Price = 150m,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Service
            {
                Name = "Sakal Tıraşı",
                DurationMin = 15,
                Price = 75m,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Service
            {
                Name = "Saç Boyama",
                DurationMin = 90,
                Price = 300m,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Service
            {
                Name = "Manikür",
                DurationMin = 45,
                Price = 100m,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Service
            {
                Name = "Pedikür",
                DurationMin = 60,
                Price = 120m,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Service
            {
                Name = "Cilt Bakımı",
                DurationMin = 60,
                Price = 200m,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Services.AddRange(services);
        await context.SaveChangesAsync();

        // Create Business Settings
        var businessSettings = new BusinessSettings
        {
            BusinessName = "Elit Berber & Kuaför",
            BusinessType = "Berber",
            Address = "Merkez Mah. Atatürk Cad. No:123 İstanbul",
            Phone = "+90 555 123 4567",
            Email = "info@elitberber.com",
            SlotDurationMinutes = 30,
            BufferTimeMinutes = 0,
            AllowSameDayBooking = true,
            MaxAdvanceBookingDays = 30,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.BusinessSettings.Add(businessSettings);
        await context.SaveChangesAsync();

        // Create Working Hours (Pazartesi-Cumartesi: 09:00-18:00, Pazar: Kapalı)
        var workingHours = new[]
        {
            new WorkingHours { DayOfWeek = DayOfWeekEnum.Sunday, IsOpen = false, OpenTime = new TimeSpan(9, 0, 0), CloseTime = new TimeSpan(18, 0, 0) },
            new WorkingHours { DayOfWeek = DayOfWeekEnum.Monday, IsOpen = true, OpenTime = new TimeSpan(9, 0, 0), CloseTime = new TimeSpan(18, 0, 0) },
            new WorkingHours { DayOfWeek = DayOfWeekEnum.Tuesday, IsOpen = true, OpenTime = new TimeSpan(9, 0, 0), CloseTime = new TimeSpan(18, 0, 0) },
            new WorkingHours { DayOfWeek = DayOfWeekEnum.Wednesday, IsOpen = true, OpenTime = new TimeSpan(9, 0, 0), CloseTime = new TimeSpan(18, 0, 0) },
            new WorkingHours { DayOfWeek = DayOfWeekEnum.Thursday, IsOpen = true, OpenTime = new TimeSpan(9, 0, 0), CloseTime = new TimeSpan(18, 0, 0) },
            new WorkingHours { DayOfWeek = DayOfWeekEnum.Friday, IsOpen = true, OpenTime = new TimeSpan(9, 0, 0), CloseTime = new TimeSpan(18, 0, 0) },
            new WorkingHours { DayOfWeek = DayOfWeekEnum.Saturday, IsOpen = true, OpenTime = new TimeSpan(9, 0, 0), CloseTime = new TimeSpan(17, 0, 0) }
        };

        context.WorkingHours.AddRange(workingHours);
        await context.SaveChangesAsync();

        // Create Break Times (Öğle arası: 12:00-13:00)
        var breakTimes = new[]
        {
            new BreakTime { DayOfWeek = DayOfWeekEnum.Monday, StartTime = new TimeSpan(12, 0, 0), EndTime = new TimeSpan(13, 0, 0), Description = "Öğle Arası" },
            new BreakTime { DayOfWeek = DayOfWeekEnum.Tuesday, StartTime = new TimeSpan(12, 0, 0), EndTime = new TimeSpan(13, 0, 0), Description = "Öğle Arası" },
            new BreakTime { DayOfWeek = DayOfWeekEnum.Wednesday, StartTime = new TimeSpan(12, 0, 0), EndTime = new TimeSpan(13, 0, 0), Description = "Öğle Arası" },
            new BreakTime { DayOfWeek = DayOfWeekEnum.Thursday, StartTime = new TimeSpan(12, 0, 0), EndTime = new TimeSpan(13, 0, 0), Description = "Öğle Arası" },
            new BreakTime { DayOfWeek = DayOfWeekEnum.Friday, StartTime = new TimeSpan(12, 0, 0), EndTime = new TimeSpan(13, 0, 0), Description = "Öğle Arası" },
            new BreakTime { DayOfWeek = DayOfWeekEnum.Saturday, StartTime = new TimeSpan(12, 0, 0), EndTime = new TimeSpan(13, 0, 0), Description = "Öğle Arası" }
        };

        context.BreakTimes.AddRange(breakTimes);
        await context.SaveChangesAsync();

        // Create sample appointments
        var firstCustomer = customers[0];
        var secondCustomer = customers[1];
        
        var appointments = new[]
        {
            new Appointment
            {
                CustomerId = firstCustomer.Id,
                ServiceId = services[0].Id,
                StartTime = DateTime.UtcNow.AddDays(1).Date.AddHours(10),
                EndTime = DateTime.UtcNow.AddDays(1).Date.AddHours(10).AddMinutes(30),
                Status = AppointmentStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Appointment
            {
                CustomerId = secondCustomer.Id,
                ServiceId = services[1].Id,
                StartTime = DateTime.UtcNow.AddDays(2).Date.AddHours(14),
                EndTime = DateTime.UtcNow.AddDays(2).Date.AddHours(14).AddMinutes(15),
                Status = AppointmentStatus.Approved,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Appointment
            {
                CustomerId = firstCustomer.Id,
                ServiceId = services[2].Id,
                StartTime = DateTime.UtcNow.AddDays(3).Date.AddHours(16),
                EndTime = DateTime.UtcNow.AddDays(3).Date.AddHours(17).AddMinutes(30),
                Status = AppointmentStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Appointments.AddRange(appointments);
        await context.SaveChangesAsync();
    }
}
