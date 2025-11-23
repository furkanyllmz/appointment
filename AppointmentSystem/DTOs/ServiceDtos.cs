namespace AppointmentSystem.DTOs;

// Service DTOs
public class CreateServiceDto
{
    public string Name { get; set; } = string.Empty;
    public int DurationMin { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateServiceDto
{
    public string? Name { get; set; }
    public int? DurationMin { get; set; }
    public decimal? Price { get; set; }
    public bool? IsActive { get; set; }
}

public class ServiceDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int DurationMin { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; }
}
