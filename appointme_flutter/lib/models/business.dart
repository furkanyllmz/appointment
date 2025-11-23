class Business {
  final int id;
  final String name;
  final String? description;
  final String? address;
  final String? phone;
  final String? workingHours;
  final double? rating;
  final String? category;

  Business({
    required this.id,
    required this.name,
    this.description,
    this.address,
    this.phone,
    this.workingHours,
    this.rating,
    this.category,
  });

  factory Business.fromJson(Map<String, dynamic> json) {
    return Business(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String?,
      address: json['address'] as String?,
      phone: json['phone'] as String?,
      workingHours: json['workingHours'] as String?,
      rating: json['rating'] != null ? (json['rating'] as num).toDouble() : null,
      category: json['category'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'address': address,
      'phone': phone,
      'workingHours': workingHours,
      'rating': rating,
      'category': category,
    };
  }
  
  String get logoUrl => 'https://ui-avatars.com/api/?name=${Uri.encodeComponent(name)}&background=000&color=fff&size=100';
}
