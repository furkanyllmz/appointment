class TimeSlot {
  final String startTime;
  final String endTime;
  final String time; // For compatibility with UI
  final bool isAvailable;

  TimeSlot({
    required this.startTime,
    required this.endTime,
    String? time,
    required this.isAvailable,
  }) : time = time ?? startTime;

  factory TimeSlot.fromJson(Map<String, dynamic> json) {
    // Handle both backend response formats
    final start = json['startTime'] as String? ?? json['time'] as String? ?? '';
    final end = json['endTime'] as String? ?? '';
    
    return TimeSlot(
      startTime: start,
      endTime: end,
      time: start,
      isAvailable: json['isAvailable'] as bool? ?? json['available'] as bool? ?? true,
    );
  }
}

