class Appointment {
  final int id;
  final int userId;
  final int serviceId;
  final DateTime appointmentDate;
  final DateTime? startTime;
  final DateTime? endTime;
  final String status;
  final String? notes;
  
  // Populated fields (from joins)
  final String? businessName;
  final String? serviceName;
  final double? servicePrice;
  final int? serviceDuration;
  final String? userName;
  final String? userEmail;

  Appointment({
    required this.id,
    required this.userId,
    required this.serviceId,
    required this.appointmentDate,
    this.startTime,
    this.endTime,
    required this.status,
    this.notes,
    this.businessName,
    this.serviceName,
    this.servicePrice,
    this.serviceDuration,
    this.userName,
    this.userEmail,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    // Backend dönüş formatı: startTime, endTime var
    // Fallback: appointmentDate varsa onu da kullan
    final startTimeStr = json['startTime'] as String?;
    final endTimeStr = json['endTime'] as String?;
    final appointmentDateStr = json['appointmentDate'] as String?;
    
    DateTime? startTime;
    DateTime? endTime;
    DateTime appointmentDate;
    
    if (startTimeStr != null) {
      startTime = DateTime.parse(startTimeStr);
      appointmentDate = startTime;
    } else if (appointmentDateStr != null) {
      appointmentDate = DateTime.parse(appointmentDateStr);
    } else {
      appointmentDate = DateTime.now();
    }
    
    if (endTimeStr != null) {
      endTime = DateTime.parse(endTimeStr);
    }
    
    return Appointment(
      id: json['id'] as int,
      userId: json['userId'] as int? ?? 0,
      serviceId: json['serviceId'] as int,
      appointmentDate: appointmentDate,
      startTime: startTime,
      endTime: endTime,
      status: json['status'] as String,
      notes: json['notes'] as String?,
      businessName: json['businessName'] as String?,
      serviceName: json['serviceName'] as String?,
      servicePrice: json['servicePrice'] != null 
          ? (json['servicePrice'] as num).toDouble() 
          : null,
      serviceDuration: json['serviceDuration'] as int?,
      userName: json['userName'] as String?,
      userEmail: json['userEmail'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'serviceId': serviceId,
      'appointmentDate': appointmentDate.toIso8601String(),
      'startTime': startTime?.toIso8601String(),
      'endTime': endTime?.toIso8601String(),
      'status': status,
      'notes': notes,
    };
  }

  bool get isPending => status.toLowerCase() == 'pending';
  bool get isApproved => status.toLowerCase() == 'approved';
  bool get isRejected => status.toLowerCase() == 'rejected';
  bool get isCompleted => status.toLowerCase() == 'completed';
  bool get isCancelled => status.toLowerCase() == 'cancelled';
  
  bool get canCancel => isPending || isApproved;
}
