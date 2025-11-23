import 'package:flutter/material.dart';
import '../models/appointment.dart';
import '../services/api_service.dart';

class AppointmentProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  List<Appointment> _appointments = [];
  bool _isLoading = false;
  String? _error;

  List<Appointment> get appointments => _appointments;
  bool get isLoading => _isLoading;
  String? get error => _error;

  List<Appointment> get pendingAppointments => 
      _appointments.where((a) => a.isPending).toList();
  
  List<Appointment> get approvedAppointments => 
      _appointments.where((a) => a.isApproved).toList();
  
  List<Appointment> get completedAppointments => 
      _appointments.where((a) => a.isCompleted).toList();

  Future<void> fetchUserAppointments([int? userId]) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      if (userId == null) {
        throw Exception('User ID is required');
      }

      final data = await _apiService.getUserAppointments(userId);
      _appointments = data.map((json) => Appointment.fromJson(json)).toList();
      
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchAllAppointments() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final data = await _apiService.getAllAppointments();
      _appointments = data.map((json) => Appointment.fromJson(json)).toList();
      
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createAppointment(int serviceId, DateTime date, [String? notes]) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      await _apiService.createAppointment(
        serviceId,
        date,
        notes,
      );
      
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

  Future<bool> cancelAppointment(int id) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      await _apiService.cancelAppointment(id);
      _appointments.removeWhere((a) => a.id == id);
      
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

  Future<bool> approveAppointment(int id) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      await _apiService.approveAppointment(id);
      
      final index = _appointments.indexWhere((a) => a.id == id);
      if (index != -1) {
        // Refresh the list
        await fetchAllAppointments();
      }
      
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

  Future<bool> rejectAppointment(int id, String reason) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      await _apiService.rejectAppointment(id, reason);
      
      final index = _appointments.indexWhere((a) => a.id == id);
      if (index != -1) {
        // Refresh the list
        await fetchAllAppointments();
      }
      
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

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
