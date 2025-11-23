import 'package:flutter/material.dart';
import '../../models/business.dart';
import '../../models/service.dart';
import '../../services/api_service.dart';

class ServiceListScreen extends StatefulWidget {
  @override
  _ServiceListScreenState createState() => _ServiceListScreenState();
}

class _ServiceListScreenState extends State<ServiceListScreen> {
  final ApiService _apiService = ApiService();
  List<Service> _services = [];
  bool _isLoading = true;
  Business? _business;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_business == null) {
      _business = ModalRoute.of(context)!.settings.arguments as Business;
      _loadServices();
    }
  }

  Future<void> _loadServices() async {
    try {
      final servicesData = await _apiService.getServicesByBusiness(_business!.id);
      setState(() {
        _services = servicesData.map((json) => Service.fromJson(json)).toList();
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Hizmetler yüklenemedi: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_business?.name ?? 'Hizmetler'),
      ),
      body: Column(
        children: [
          // Business Header
          if (_business != null)
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
                          _business!.name,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          _business!.category ?? 'İşletme',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                        SizedBox(height: 4),
                        Row(
                          children: [
                            Icon(Icons.star, size: 16, color: Colors.amber),
                            SizedBox(width: 4),
                            Text(
                              _business!.rating?.toStringAsFixed(1) ?? '0.0',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
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

          // Services Grid
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator())
                : _services.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.spa, size: 64, color: Colors.grey),
                            SizedBox(height: 16),
                            Text(
                              'Henüz hizmet yok',
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadServices,
                        child: GridView.builder(
                          padding: EdgeInsets.all(16),
                          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 0.85,
                            crossAxisSpacing: 16,
                            mainAxisSpacing: 16,
                          ),
                          itemCount: _services.length,
                          itemBuilder: (context, index) {
                            final service = _services[index];
                            return _buildServiceCard(service);
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildServiceCard(Service service) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          Navigator.pushNamed(
            context,
            '/booking',
            arguments: {
              'business': _business,
              'service': service,
            },
          );
        },
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Service Icon
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  _getServiceIcon(service.name),
                  size: 32,
                  color: Colors.black,
                ),
              ),
              SizedBox(height: 12),

              // Service Name
              Text(
                service.name,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              Spacer(),

              // Price and Duration
              Row(
                children: [
                  Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                  SizedBox(width: 4),
                  Text(
                    service.formattedDuration,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
              SizedBox(height: 8),
              Text(
                service.formattedPrice,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getServiceIcon(String serviceName) {
    final name = serviceName.toLowerCase();
    if (name.contains('saç') || name.contains('hair')) {
      return Icons.content_cut;
    } else if (name.contains('tırnak') || name.contains('nail')) {
      return Icons.spa;
    } else if (name.contains('masaj') || name.contains('massage')) {
      return Icons.self_improvement;
    } else if (name.contains('cilt') || name.contains('skin')) {
      return Icons.face;
    } else if (name.contains('makyaj') || name.contains('makeup')) {
      return Icons.brush;
    } else if (name.contains('barber') || name.contains('traş')) {
      return Icons.cut;
    } else {
      return Icons.star;
    }
  }
}
