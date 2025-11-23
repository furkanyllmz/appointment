namespace AppointmentSystem.DTOs;

// Appointment DTOs
public class CreateAppointmentDto
{
    public int ServiceId { get; set; }
    public string AppointmentDate { get; set; } = string.Empty;
    public string AppointmentTime { get; set; } = string.Empty;
}

public class AppointmentDto
{
    public int Id { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? AdminNote { get; set; }
}

public class AppointmentDetailDto : AppointmentDto
{
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
}

public class RejectAppointmentDto
{
    public string? AdminNote { get; set; }
}
