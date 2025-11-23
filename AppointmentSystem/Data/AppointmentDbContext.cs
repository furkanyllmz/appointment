using Microsoft.EntityFrameworkCore;
using AppointmentSystem.Models;

namespace AppointmentSystem.Data;

public class AppointmentDbContext : DbContext
{
    public AppointmentDbContext(DbContextOptions<AppointmentDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<BusinessSettings> BusinessSettings { get; set; }
    public DbSet<WorkingHours> WorkingHours { get; set; }
    public DbSet<BreakTime> BreakTimes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FullName).HasColumnName("full_name").IsRequired().HasMaxLength(200);
            entity.Property(e => e.Email).HasColumnName("email").IsRequired().HasMaxLength(200);
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash").IsRequired();
            entity.Property(e => e.Role).HasColumnName("role").IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Service configuration
        modelBuilder.Entity<Service>(entity =>
        {
            entity.ToTable("services");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name").IsRequired().HasMaxLength(200);
            entity.Property(e => e.DurationMin).HasColumnName("duration_min").IsRequired();
            entity.Property(e => e.IsActive).HasColumnName("is_active").IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        // Appointment configuration
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.ToTable("appointments");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CustomerId).HasColumnName("customer_id").IsRequired();
            entity.Property(e => e.ServiceId).HasColumnName("service_id").IsRequired();
            entity.Property(e => e.StartTime).HasColumnName("start_time").IsRequired();
            entity.Property(e => e.EndTime).HasColumnName("end_time").IsRequired();
            entity.Property(e => e.Status).HasColumnName("status").IsRequired();
            entity.Property(e => e.AdminNote).HasColumnName("admin_note").HasMaxLength(1000);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(e => e.Customer)
                .WithMany(u => u.Appointments)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Service)
                .WithMany(s => s.Appointments)
                .HasForeignKey(e => e.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // BusinessSettings configuration
        modelBuilder.Entity<BusinessSettings>(entity =>
        {
            entity.ToTable("business_settings");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BusinessName).HasColumnName("business_name").IsRequired().HasMaxLength(200);
            entity.Property(e => e.BusinessType).HasColumnName("business_type").HasMaxLength(100);
            entity.Property(e => e.Address).HasColumnName("address").HasMaxLength(500);
            entity.Property(e => e.Phone).HasColumnName("phone").HasMaxLength(20);
            entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(200);
            entity.Property(e => e.SlotDurationMinutes).HasColumnName("slot_duration_minutes");
            entity.Property(e => e.BufferTimeMinutes).HasColumnName("buffer_time_minutes");
            entity.Property(e => e.AllowSameDayBooking).HasColumnName("allow_same_day_booking");
            entity.Property(e => e.MaxAdvanceBookingDays).HasColumnName("max_advance_booking_days");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        // WorkingHours configuration
        modelBuilder.Entity<WorkingHours>(entity =>
        {
            entity.ToTable("working_hours");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DayOfWeek).HasColumnName("day_of_week").IsRequired();
            entity.Property(e => e.IsOpen).HasColumnName("is_open").IsRequired();
            entity.Property(e => e.OpenTime).HasColumnName("open_time");
            entity.Property(e => e.CloseTime).HasColumnName("close_time");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        // BreakTime configuration
        modelBuilder.Entity<BreakTime>(entity =>
        {
            entity.ToTable("break_times");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DayOfWeek).HasColumnName("day_of_week").IsRequired();
            entity.Property(e => e.StartTime).HasColumnName("start_time");
            entity.Property(e => e.EndTime).HasColumnName("end_time");
            entity.Property(e => e.Description).HasColumnName("description").HasMaxLength(200);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });
    }
}
