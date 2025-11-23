import 'package:flutter/material.dart';
import 'package:jwt_decode/jwt_decode.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _user != null;
  bool get isAdmin => _user?.isAdmin ?? false;
  bool get isCustomer => _user?.isCustomer ?? false;

  Future<bool> login(String email, String password) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final data = await _apiService.login(email, password);
      // Backend data ya data['user'] ya da data'nın kendisi olabilir
      final userData = data['user'] ?? data;
      _user = User.fromJson(userData);
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(String name, String email, String password, String phone) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final data = await _apiService.register(name, email, password, phone);
      // Backend data ya data['user'] ya da data'nın kendisi olabilir
      final userData = data['user'] ?? data;
      _user = User.fromJson(userData);
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> checkAuth() async {
    try {
      final userData = await _apiService.getCurrentUser();
      _user = User.fromJson(userData);
      notifyListeners();
    } catch (e) {
      _user = null;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _apiService.clearToken();
    _user = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
