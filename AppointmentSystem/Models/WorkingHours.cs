namespace AppointmentSystem.Models;

public enum DayOfWeekEnum
{
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}

public class WorkingHours
{
    public int Id { get; set; }
    public DayOfWeekEnum DayOfWeek { get; set; }
    public bool IsOpen { get; set; } = true;
    public TimeSpan OpenTime { get; set; } = new TimeSpan(9, 0, 0); // 09:00
    public TimeSpan CloseTime { get; set; } = new TimeSpan(18, 0, 0); // 18:00
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
