class Service {
  final int id;
  final int? businessId;
  final String name;
  final String? description;
  final int durationMinutes;
  final double? price;
  final bool isActive;

  Service({
    required this.id,
    this.businessId,
    required this.name,
    this.description,
    required this.durationMinutes,
    this.price,
    this.isActive = true,
  });

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['id'] as int,
      businessId: json['businessId'] as int?,
      name: json['name'] as String,
      description: json['description'] as String?,
      durationMinutes: json['durationMin'] as int? ?? json['durationMinutes'] as int? ?? 30,
      price: json['price'] != null ? (json['price'] as num).toDouble() : null,
      isActive: json['isActive'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'businessId': businessId,
      'name': name,
      'description': description,
      'durationMin': durationMinutes,
      'price': price,
      'isActive': isActive,
    };
  }
  
  String get formattedPrice => price != null ? '₺${price!.toStringAsFixed(0)}' : 'Fiyat yok';
  String get formattedDuration => '${durationMinutes} dk';
}
