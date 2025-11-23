import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';

class ApiService {
  // Platform'a göre otomatik endpoint
  static String get baseUrl {
    if (Platform.isIOS) {
      return 'http://127.0.0.1:5025/api';
    } else if (Platform.isAndroid) {
      return 'http://10.0.2.2:5025/api';
    } else {
      return 'http://127.0.0.1:5025/api';
    }
  }

  // Token Management
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }

  Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
  }

  // Headers
  Map<String, String> _getHeaders({bool withAuth = false}) {
    return {
      'Content-Type': 'application/json',
    };
  }

  Future<Map<String, String>> _getAuthHeaders() async {
    final token = await _getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  // HTTP Methods
  Future<http.Response> get(String endpoint, {bool withAuth = true}) async {
    final url = Uri.parse('$baseUrl$endpoint');
    final headers = withAuth ? await _getAuthHeaders() : _getHeaders();
    return await http.get(url, headers: headers);
  }

  Future<http.Response> post(String endpoint, dynamic body, {bool withAuth = true}) async {
    final url = Uri.parse('$baseUrl$endpoint');
    final headers = withAuth ? await _getAuthHeaders() : _getHeaders(withAuth: false);
    print('DEBUG: POST $url with headers: $headers');
    print('DEBUG: POST body: ${jsonEncode(body)}');
    return await http.post(url, headers: headers, body: jsonEncode(body));
  }

  Future<http.Response> put(String endpoint, dynamic body, {bool withAuth = true}) async {
    final url = Uri.parse('$baseUrl$endpoint');
    final headers = withAuth ? await _getAuthHeaders() : _getHeaders(withAuth: false);
    return await http.put(url, headers: headers, body: jsonEncode(body));
  }

  Future<http.Response> delete(String endpoint, {bool withAuth = true}) async {
    final url = Uri.parse('$baseUrl$endpoint');
    final headers = withAuth ? await _getAuthHeaders() : _getHeaders();
    return await http.delete(url, headers: headers);
  }

  // Auth Endpoints
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await post('/auth/login', {
      'email': email,
      'password': password,
    }, withAuth: false);

    print('DEBUG: Login response status: ${response.statusCode}');
    print('DEBUG: Login response body: ${response.body}');

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await _saveToken(data['token']);
      return data;
    } else {
      throw Exception('Login failed: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> register(String name, String email, String password, String phone) async {
    final response = await post('/auth/register', {
      'name': name,
      'email': email,
      'password': password,
      'phone': phone,
    }, withAuth: false);

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      await _saveToken(data['token']);
      return data;
    } else {
      throw Exception('Registration failed: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> getCurrentUser() async {
    final response = await get('/auth/me');

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to get user: ${response.body}');
    }
  }

  // Business Endpoints
  Future<List<dynamic>> getBusinesses() async {
    final response = await get('/businesses', withAuth: false);

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List;
    } else {
      throw Exception('Failed to load businesses');
    }
  }

  Future<Map<String, dynamic>> getBusiness(int id) async {
    final response = await get('/businesses/$id', withAuth: false);

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load business');
    }
  }

  // Service Endpoints
  Future<List<dynamic>> getServicesByBusiness(int businessId) async {
    try {
      // Try the new endpoint first
      final response = await get('/services/business/$businessId', withAuth: false);
      if (response.statusCode == 200) {
        return jsonDecode(response.body) as List;
      }
    } catch (e) {
      print('DEBUG: /services/business/$businessId endpoint failed: $e');
    }
    
    // Fallback: try alternate endpoint
    try {
      final response = await get('/services', withAuth: true);
      if (response.statusCode == 200) {
        // Return all services (filter on client side if needed)
        return jsonDecode(response.body) as List;
      }
    } catch (e) {
      print('DEBUG: /services endpoint failed: $e');
    }
    
    throw Exception('Failed to load services');
  }

  // Appointment Endpoints
  Future<List<dynamic>> getAvailableSlots(int serviceId, String date) async {
    final response = await get('/availability?serviceId=$serviceId&date=$date', withAuth: true);

    print('DEBUG: Availability response status: ${response.statusCode}');
    print('DEBUG: Availability response body: ${response.body}');

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List;
    } else {
      throw Exception('Failed to load slots: ${response.statusCode} - ${response.body}');
    }
  }

  Future<Map<String, dynamic>> createAppointment(int serviceId, DateTime appointmentDateTime, [String? notes]) async {
    final dateStr = DateFormat('yyyy-MM-dd').format(appointmentDateTime);
    final timeStr = DateFormat('HH:mm').format(appointmentDateTime);
    
    print('DEBUG: Creating appointment - serviceId: $serviceId, date: $dateStr, time: $timeStr');
    
    final response = await post('/appointments', {
      'serviceId': serviceId,
      'appointmentDate': dateStr,
      'appointmentTime': timeStr,
      'notes': notes,
    });

    print('DEBUG: Appointment response status: ${response.statusCode}');
    print('DEBUG: Appointment response body: ${response.body}');

    if (response.statusCode == 200 || response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to create appointment: ${response.body}');
    }
  }

  Future<List<dynamic>> getUserAppointments(int userId) async {
    final response = await get('/appointments/user/$userId');

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List;
    } else {
      throw Exception('Failed to load appointments');
    }
  }

  Future<void> cancelAppointment(int id) async {
    final response = await put('/appointments/$id/cancel', {});

    if (response.statusCode != 200) {
      throw Exception('Failed to cancel appointment');
    }
  }

  // Admin Endpoints
  Future<List<dynamic>> getAllAppointments() async {
    final response = await get('/admin/appointments');

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List;
    } else {
      throw Exception('Failed to load appointments');
    }
  }

  Future<void> approveAppointment(int id) async {
    final response = await put('/admin/appointments/$id/approve', {});

    if (response.statusCode != 200) {
      throw Exception('Failed to approve appointment');
    }
  }

  Future<void> rejectAppointment(int id, String reason) async {
    final response = await put('/admin/appointments/$id/reject', {'reason': reason});

    if (response.statusCode != 200) {
      throw Exception('Failed to reject appointment');
    }
  }

  Future<Map<String, dynamic>> getAdminStats() async {
    final response = await get('/admin/stats');

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load stats');
    }
  }
}
