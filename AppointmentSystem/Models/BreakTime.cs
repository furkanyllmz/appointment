namespace AppointmentSystem.Models;

public class BreakTime
{
    public int Id { get; set; }
    public DayOfWeekEnum DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string Description { get; set; } = string.Empty; // örn: "Öğle Arası"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
