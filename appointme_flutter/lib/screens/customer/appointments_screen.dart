import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../models/appointment.dart';
import '../../providers/appointment_provider.dart';
import '../../providers/auth_provider.dart';

class AppointmentsScreen extends StatefulWidget {
  @override
  _AppointmentsScreenState createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadAppointments();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadAppointments() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    if (!authProvider.isLoggedIn) {
      Navigator.pushReplacementNamed(context, '/login');
      return;
    }

    final appointmentProvider = Provider.of<AppointmentProvider>(context, listen: false);
    await appointmentProvider.fetchUserAppointments(authProvider.user?.id);
  }

  Future<void> _cancelAppointment(Appointment appointment) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Randevuyu İptal Et'),
        content: Text('Bu randevuyu iptal etmek istediğinizden emin misiniz?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text('Hayır'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: Text('İptal Et'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      final appointmentProvider = Provider.of<AppointmentProvider>(context, listen: false);
      try {
        await appointmentProvider.cancelAppointment(appointment.id);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Randevu iptal edildi')),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Randevu iptal edilemedi: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Randevularım'),
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(text: 'Bekleyen'),
            Tab(text: 'Onaylanan'),
            Tab(text: 'Geçmiş'),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.home),
            onPressed: () {
              Navigator.pushReplacementNamed(context, '/businesses');
            },
          ),
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

          return TabBarView(
            controller: _tabController,
            children: [
              _buildAppointmentList(appointmentProvider.pendingAppointments, 'pending'),
              _buildAppointmentList(appointmentProvider.approvedAppointments, 'approved'),
              _buildAppointmentList([
                ...appointmentProvider.completedAppointments,
                ...appointmentProvider.appointments.where((a) => a.status == 'Rejected').toList(),
              ], 'completed'),
            ],
          );
        },
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
                      : 'Geçmiş randevu yok',
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
      onRefresh: _loadAppointments,
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
            // Header with status
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
                        child: Text(
                          appointment.serviceName ?? 'Hizmet',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
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

            // Business Name
            if (appointment.businessName != null) ...[
              Row(
                children: [
                  Icon(Icons.business, size: 16, color: Colors.grey[600]),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      appointment.businessName!,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 8),
            ],

            // Date and Time
            Row(
              children: [
                Icon(Icons.calendar_today, size: 16, color: Colors.grey[600]),
                SizedBox(width: 8),
                Text(
                  DateFormat('dd MMMM yyyy', 'tr').format(appointment.startTime ?? appointment.appointmentDate),
                  style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                ),
                SizedBox(width: 16),
                Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                SizedBox(width: 8),
                Text(
                  DateFormat('HH:mm').format(appointment.startTime ?? appointment.appointmentDate),
                  style: TextStyle(fontSize: 14, color: Colors.grey[800]),
                ),
              ],
            ),

            // Cancel button for pending/approved appointments
            if (appointment.canCancel) ...[
              SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => _cancelAppointment(appointment),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.red,
                    side: BorderSide(color: Colors.red),
                  ),
                  child: Text('Randevuyu İptal Et'),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
