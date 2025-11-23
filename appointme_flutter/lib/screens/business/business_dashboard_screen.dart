import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../models/appointment.dart';
import '../../providers/appointment_provider.dart';
import '../../providers/auth_provider.dart';

class BusinessDashboardScreen extends StatefulWidget {
  @override
  _BusinessDashboardScreenState createState() => _BusinessDashboardScreenState();
}

class _BusinessDashboardScreenState extends State<BusinessDashboardScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isLoading = true;
  List<Appointment> _appointments = [];
  Map<String, int> _stats = {
    'pending': 0,
    'approved': 0,
    'completed': 0,
    'total': 0,
  };

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    if (!authProvider.isLoggedIn) {
      Navigator.pushReplacementNamed(context, '/welcome');
      return;
    }

    try {
      final appointmentProvider = Provider.of<AppointmentProvider>(context, listen: false);
      await appointmentProvider.fetchAllAppointments();
      
      setState(() {
        _appointments = appointmentProvider.appointments;
        _stats = {
          'pending': appointmentProvider.pendingAppointments.length,
          'approved': appointmentProvider.approvedAppointments.length,
          'completed': _appointments.where((a) => a.status == 'Completed').length,
          'total': _appointments.length,
        };
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading data: $e');
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Veriler yüklenemedi: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _approveAppointment(Appointment appointment) async {
    final appointmentProvider = Provider.of<AppointmentProvider>(context, listen: false);
    try {
      await appointmentProvider.approveAppointment(appointment.id);
      await _loadData();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Randevu onaylandı'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Randevu onaylanamadı: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _rejectAppointment(Appointment appointment) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Randevuyu Reddet'),
        content: Text('Bu randevuyu reddetmek istediğinizden emin misiniz?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text('Hayır'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: Text('Reddet'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      final appointmentProvider = Provider.of<AppointmentProvider>(context, listen: false);
      try {
        await appointmentProvider.rejectAppointment(
          appointment.id,
          'İşletme tarafından reddedildi',
        );
        await _loadData();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Randevu reddedildi')),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Randevu reddedilemedi: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final businessName = authProvider.user?.name ?? 'İşletme';

    return Scaffold(
      appBar: AppBar(
        title: Text('İşletme Paneli'),
        backgroundColor: Colors.black,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(text: 'Bekleyen'),
            Tab(text: 'Onaylanan'),
            Tab(text: 'Tamamlanan'),
          ],
        ),
        actions: [
          PopupMenuButton<String>(
            icon: Icon(Icons.account_circle),
            onSelected: (value) {
              if (value == 'logout') {
                authProvider.logout();
                Navigator.pushReplacementNamed(context, '/welcome');
              }
            },
            itemBuilder: (context) => [
              PopupMenuItem(
                value: 'profile',
                child: Row(
                  children: [
                    Icon(Icons.person, color: Colors.black),
                    SizedBox(width: 12),
                    Text(businessName),
                  ],
                ),
                enabled: false,
              ),
              PopupMenuDivider(),
              PopupMenuItem(
                value: 'logout',
                child: Row(
                  children: [
                    Icon(Icons.logout, color: Colors.red),
                    SizedBox(width: 12),
                    Text('Çıkış Yap', style: TextStyle(color: Colors.red)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Stats Cards
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(16),
                  color: Colors.grey[50],
                  child: Column(
                    children: [
                      Text(
                        'Hoş geldiniz, $businessName',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      SizedBox(height: 16),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            _buildStatCard(
                              label: 'Bugünün Randevuları',
                              value: _stats['total'].toString(),
                              icon: Icons.calendar_today,
                              color: Colors.green,
                            ),
                            SizedBox(width: 12),
                            _buildStatCard(
                              label: 'Bekleyen',
                              value: _stats['pending'].toString(),
                              icon: Icons.schedule,
                              color: Colors.orange,
                            ),
                            SizedBox(width: 12),
                            _buildStatCard(
                              label: 'Onaylanan',
                              value: _stats['approved'].toString(),
                              icon: Icons.check_circle,
                              color: Colors.green,
                            ),
                            SizedBox(width: 12),
                            _buildStatCard(
                              label: 'Tamamlanan',
                              value: _stats['completed'].toString(),
                              icon: Icons.done_all,
                              color: Colors.blue,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                // Appointments List
                Expanded(
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      _buildAppointmentList(
                        _appointments.where((a) => a.status == 'Pending').toList(),
                        'pending',
                      ),
                      _buildAppointmentList(
                        _appointments.where((a) => a.status == 'Approved').toList(),
                        'approved',
                      ),
                      _buildAppointmentList(
                        _appointments.where((a) => a.status == 'Completed').toList(),
                        'completed',
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildStatCard({
    required String label,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [color, color.withOpacity(0.7)],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.3),
            blurRadius: 8,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
          SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              color: Colors.white.withOpacity(0.9),
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAppointmentList(List<Appointment> appointments, String type) {
    if (appointments.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.calendar_today, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text(
              type == 'pending'
                  ? 'Bekleyen randevu yok'
                  : type == 'approved'
                      ? 'Onaylanan randevu yok'
                      : 'Tamamlanan randevu yok',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: EdgeInsets.all(16),
        itemCount: appointments.length,
        itemBuilder: (context, index) {
          final appointment = appointments[index];
          return _buildAppointmentCard(appointment);
        },
      ),
    );
  }

  Widget _buildAppointmentCard(Appointment appointment) {
    Color statusColor;
    IconData statusIcon;

    switch (appointment.status) {
      case 'Pending':
        statusColor = Colors.orange;
        statusIcon = Icons.schedule;
        break;
      case 'Approved':
        statusColor = Colors.green;
        statusIcon = Icons.check_circle;
        break;
      case 'Completed':
        statusColor = Colors.blue;
        statusIcon = Icons.done_all;
        break;
      case 'Cancelled':
      case 'Rejected':
        statusColor = Colors.red;
        statusIcon = Icons.close;
        break;
      default:
        statusColor = Colors.grey;
        statusIcon = Icons.help;
    }

    return Card(
      margin: EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: statusColor.withOpacity(0.3),
          width: 2,
        ),
      ),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        appointment.userName ?? 'Müşteri',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        appointment.serviceName ?? 'Hizmet',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Icon(statusIcon, size: 14, color: statusColor),
                      SizedBox(width: 4),
                      Text(
                        appointment.status,
                        style: TextStyle(
                          color: statusColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),

            // Date and Time
            Row(
              children: [
                Icon(Icons.calendar_today, size: 14, color: Colors.grey[500]),
                SizedBox(width: 8),
                Text(
                  DateFormat('dd MMMM yyyy', 'tr').format(appointment.appointmentDate),
                  style: TextStyle(fontSize: 13, color: Colors.grey[700]),
                ),
                SizedBox(width: 16),
                Icon(Icons.access_time, size: 14, color: Colors.grey[500]),
                SizedBox(width: 8),
                Text(
                  DateFormat('HH:mm').format(appointment.appointmentDate),
                  style: TextStyle(fontSize: 13, color: Colors.grey[700]),
                ),
              ],
            ),

            // Action Buttons for Pending
            if (appointment.status == 'Pending') ...[
              SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _rejectAppointment(appointment),
                      icon: Icon(Icons.close, size: 16),
                      label: Text('Reddet'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.red,
                        side: BorderSide(color: Colors.red),
                      ),
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => _approveAppointment(appointment),
                      icon: Icon(Icons.check, size: 16),
                      label: Text('Onayla'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
