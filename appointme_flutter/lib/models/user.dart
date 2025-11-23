class User {
  final int id;
  final String name;
  final String email;
  final String role;
  final String? phone;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.phone,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      name: (json['name'] ?? json['fullName'] ?? json['full_name'] ?? '') as String,
      email: json['email'] as String,
      role: json['role'] as String,
      phone: json['phone'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'phone': phone,
    };
  }

  bool get isAdmin => role.toLowerCase() == 'admin';
  bool get isCustomer => role.toLowerCase() == 'customer';
}
