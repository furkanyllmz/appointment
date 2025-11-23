import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../models/appointment.dart';
import '../../providers/appointment_provider.dart';
import '../../providers/auth_provider.dart';

class AdminDashboardScreen extends StatefulWidget {
  @override
  _AdminDashboardScreenState createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  Map<String, dynamic>? _stats;

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
    if (!authProvider.isLoggedIn || !authProvider.isAdmin) {
      Navigator.pushReplacementNamed(context, '/welcome');
      return;
    }

    final appointmentProvider = Provider.of<AppointmentProvider>(context, listen: false);
    await appointmentProvider.fetchAllAppointments();
    
    // Load stats (optional)
    // _stats = await appointmentProvider.getAdminStats();
  }

  Future<void> _approveAppointment(Appointment appointment) async {
    final appointmentProvider = Provider.of<AppointmentProvider>(context, listen: false);
    try {
      await appointmentProvider.approveAppointment(appointment.id);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Randevu onaylandı'), backgroundColor: Colors.green),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Randevu onaylanamadı: $e'), backgroundColor: Colors.red),
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
        await appointmentProvider.rejectAppointment(appointment.id, 'Admin tarafından reddedildi');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Randevu reddedildi')),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Randevu reddedilemedi: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('İşletme Yönetimi'),
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(text: 'Bekleyen'),
            Tab(text: 'Onaylanan'),
            Tab(text: 'Tüm Randevular'),
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
                    Text('${authProvider.user?.name ?? "Admin"}'),
                  ],
                ),
                enabled: false,
              ),
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
      body: Consumer<AppointmentProvider>(
        builder: (context, appointmentProvider, child) {
          if (appointmentProvider.isLoading) {
            return Center(child: CircularProgressIndicator());
          }

          return Column(
            children: [
              // Stats Card
              Container(
                width: double.infinity,
                padding: EdgeInsets.all(16),
                color: Colors.grey[50],
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStatItem(
                      'Bekleyen',
                      appointmentProvider.pendingAppointments.length.toString(),
                      Colors.orange,
                      Icons.schedule,
                    ),
                    _buildStatItem(
                      'Onaylanan',
                      appointmentProvider.approvedAppointments.length.toString(),
                      Colors.green,
                      Icons.check_circle,
                    ),
                    _buildStatItem(
                      'Toplam',
                      appointmentProvider.appointments.length.toString(),
                      Colors.blue,
                      Icons.calendar_today,
                    ),
                  ],
                ),
              ),

              // Appointments List
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _buildAppointmentList(appointmentProvider.pendingAppointments, 'pending'),
                    _buildAppointmentList(appointmentProvider.approvedAppointments, 'approved'),
                    _buildAppointmentList(appointmentProvider.appointments, 'all'),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildStatItem(String label, String value, Color color, IconData icon) {
    return Column(
      children: [
        Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: color, size: 28),
        ),
        SizedBox(height: 8),
        Text(
          value,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
      ],
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
                      : 'Randevu yok',
              style: TextStyle(
                fontSize: 18,
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
          return _buildAppointmentCard(appointment, type);
        },
      ),
    );
  }

  Widget _buildAppointmentCard(Appointment appointment, String type) {
    Color statusColor;
    String statusText;
    IconData statusIcon;

    switch (appointment.status) {
      case 'Pending':
        statusColor = Colors.orange;
        statusText = 'Bekliyor';
        statusIcon = Icons.schedule;
        break;
      case 'Approved':
        statusColor = Colors.green;
        statusText = 'Onaylandı';
        statusIcon = Icons.check_circle;
        break;
      case 'Completed':
        statusColor = Colors.blue;
        statusText = 'Tamamlandı';
        statusIcon = Icons.done_all;
        break;
      case 'Cancelled':
        statusColor = Colors.red;
        statusText = 'İptal Edildi';
        statusIcon = Icons.cancel;
        break;
      case 'Rejected':
        statusColor = Colors.red;
        statusText = 'Reddedildi';
        statusIcon = Icons.close;
        break;
      default:
        statusColor = Colors.grey;
        statusText = appointment.status;
        statusIcon = Icons.help;
    }

    return Card(
      margin: EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: statusColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(statusIcon, color: statusColor, size: 24),
                      ),
                      SizedBox(width: 12),
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
                    ],
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    statusText,
                    style: TextStyle(
                      color: statusColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),

            // Date and Time
            Row(
              children: [
                Icon(Icons.calendar_today, size: 16, color: Colors.grey[600]),
                SizedBox(width: 8),
                Text(
                  DateFormat('dd MMMM yyyy', 'tr').format(appointment.appointmentDate),
                  style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                ),
                SizedBox(width: 16),
                Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                SizedBox(width: 8),
                Text(
                  DateFormat('HH:mm').format(appointment.appointmentDate),
                  style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                ),
              ],
            ),

            // Action buttons for pending appointments
            if (appointment.isPending) ...[
              SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => _rejectAppointment(appointment),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.red,
                        side: BorderSide(color: Colors.red),
                      ),
                      child: Text('Reddet'),
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _approveAppointment(appointment),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                      ),
                      child: Text('Onayla'),
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
