import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import '../../models/business.dart';
import '../../models/service.dart';
import '../../models/time_slot.dart';
import '../../services/api_service.dart';
import '../../providers/auth_provider.dart';
import '../../providers/appointment_provider.dart';

class BookingScreen extends StatefulWidget {
  @override
  _BookingScreenState createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  final ApiService _apiService = ApiService();
  Business? _business;
  Service? _service;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  List<TimeSlot> _timeSlots = [];
  TimeSlot? _selectedTimeSlot;
  bool _isLoadingSlots = false;
  bool _isBooking = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_business == null) {
      final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
      _business = args['business'] as Business;
      _service = args['service'] as Service;
      _selectedDay = DateTime.now();
      _loadTimeSlots(_selectedDay!);
    }
  }

  Future<void> _loadTimeSlots(DateTime date) async {
    setState(() {
      _isLoadingSlots = true;
      _selectedTimeSlot = null;
    });

    try {
      final slotsData = await _apiService.getAvailableSlots(
        _service!.id,
        DateFormat('yyyy-MM-dd').format(date),
      );
      setState(() {
        _timeSlots = slotsData.map((json) => TimeSlot.fromJson(json)).toList();
        _isLoadingSlots = false;
      });
    } catch (e) {
      setState(() => _isLoadingSlots = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Uygun saatler yüklenemedi: $e')),
      );
    }
  }

  Future<void> _bookAppointment() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    if (!authProvider.isLoggedIn) {
      final result = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Giriş Yapın'),
          content: Text('Randevu oluşturmak için giriş yapmanız gerekiyor.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: Text('İptal'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              child: Text('Giriş Yap'),
            ),
          ],
        ),
      );

      if (result == true) {
        Navigator.pushNamed(context, '/login');
      }
      return;
    }

    if (_selectedDay == null || _selectedTimeSlot == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lütfen tarih ve saat seçin')),
      );
      return;
    }

    setState(() => _isBooking = true);

    try {
      final appointmentProvider = Provider.of<AppointmentProvider>(context, listen: false);
      final dateTime = DateTime(
        _selectedDay!.year,
        _selectedDay!.month,
        _selectedDay!.day,
        int.parse(_selectedTimeSlot!.time.split(':')[0]),
        int.parse(_selectedTimeSlot!.time.split(':')[1]),
      );

      await appointmentProvider.createAppointment(
        _service!.id,
        dateTime,
      );

      setState(() => _isBooking = false);

      if (!mounted) return;

      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Row(
            children: [
              Icon(Icons.check_circle, color: Colors.green, size: 28),
              SizedBox(width: 12),
              Text('Başarılı'),
            ],
          ),
          content: Text('Randevunuz başarıyla oluşturuldu!'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pushNamedAndRemoveUntil(
                  context,
                  '/appointments',
                  (route) => false,
                );
              },
              child: Text('Randevularım'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pushNamedAndRemoveUntil(
                  context,
                  '/businesses',
                  (route) => false,
                );
              },
              child: Text('Ana Sayfa'),
            ),
          ],
        ),
      );
    } catch (e) {
      setState(() => _isBooking = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Randevu oluşturulamadı: $e'), backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Randevu Oluştur'),
      ),
      body: Column(
        children: [
          // Service Info Card
          if (_service != null && _business != null)
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(16),
              color: Colors.grey[50],
              child: Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      image: DecorationImage(
                        image: NetworkImage(_business!.logoUrl),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _service!.name,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          _business!.name,
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                        SizedBox(height: 4),
                        Row(
                          children: [
                            Text(
                              _service!.formattedPrice,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(width: 12),
                            Text(
                              _service!.formattedDuration,
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Calendar
                  Padding(
                    padding: EdgeInsets.all(16),
                    child: Text(
                      'Tarih Seçin',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  TableCalendar(
                    firstDay: DateTime.now(),
                    lastDay: DateTime.now().add(Duration(days: 90)),
                    focusedDay: _focusedDay,
                    selectedDayPredicate: (day) {
                      return _selectedDay != null && isSameDay(_selectedDay, day);
                    },
                    onDaySelected: (selectedDay, focusedDay) {
                      if (!isSameDay(_selectedDay, selectedDay)) {
                        setState(() {
                          _selectedDay = selectedDay;
                          _focusedDay = focusedDay;
                        });
                        _loadTimeSlots(selectedDay);
                      }
                    },
                    calendarFormat: CalendarFormat.month,
                    locale: 'tr',
                    headerStyle: HeaderStyle(
                      formatButtonVisible: false,
                      titleCentered: true,
                    ),
                    calendarStyle: CalendarStyle(
                      selectedDecoration: BoxDecoration(
                        color: Colors.black,
                        shape: BoxShape.circle,
                      ),
                      todayDecoration: BoxDecoration(
                        color: Colors.grey[400],
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),

                  // Time Slots
                  Padding(
                    padding: EdgeInsets.all(16),
                    child: Text(
                      'Saat Seçin',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  _isLoadingSlots
                      ? Center(
                          child: Padding(
                            padding: EdgeInsets.all(32),
                            child: CircularProgressIndicator(),
                          ),
                        )
                      : _timeSlots.isEmpty
                          ? Center(
                              child: Padding(
                                padding: EdgeInsets.all(32),
                                child: Text(
                                  'Bu tarih için uygun saat yok',
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.grey[600],
                                  ),
                                ),
                              ),
                            )
                          : Padding(
                              padding: EdgeInsets.symmetric(horizontal: 16),
                              child: Wrap(
                                spacing: 12,
                                runSpacing: 12,
                                children: _timeSlots.map((slot) {
                                  final isSelected = _selectedTimeSlot == slot;
                                  return ChoiceChip(
                                    label: Text(slot.time),
                                    selected: isSelected,
                                    onSelected: slot.isAvailable
                                        ? (selected) {
                                            setState(() {
                                              _selectedTimeSlot = selected ? slot : null;
                                            });
                                          }
                                        : null,
                                    selectedColor: Colors.black,
                                    labelStyle: TextStyle(
                                      color: isSelected ? Colors.white : Colors.black,
                                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                    ),
                                    backgroundColor: slot.isAvailable ? Colors.grey[100] : Colors.grey[300],
                                    disabledColor: Colors.grey[300],
                                  );
                                }).toList(),
                              ),
                            ),
                  SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: Offset(0, -5),
            ),
          ],
        ),
        child: SafeArea(
          child: SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: _isBooking || _selectedDay == null || _selectedTimeSlot == null
                  ? null
                  : _bookAppointment,
              child: _isBooking
                  ? CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    )
                  : Text(
                      'Randevu Oluştur',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
            ),
          ),
        ),
      ),
    );
  }
}
