namespace AppointmentSystem.Models;

public class BusinessSettings
{
    public int Id { get; set; }
    public string BusinessName { get; set; } = string.Empty;
    public string BusinessType { get; set; } = string.Empty; // Berber, Kuaför, vb.
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    
    // Randevu Ayarları
    public int SlotDurationMinutes { get; set; } = 30; // Randevu slot süresi
    public int BufferTimeMinutes { get; set; } = 0; // Randevular arası boşluk
    public bool AllowSameDayBooking { get; set; } = true;
    public int MaxAdvanceBookingDays { get; set; } = 30; // Kaç gün önceden randevu alınabilir
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
