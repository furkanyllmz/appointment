import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/business.dart';
import '../../services/api_service.dart';
import '../../providers/auth_provider.dart';

class BusinessListScreen extends StatefulWidget {
  @override
  _BusinessListScreenState createState() => _BusinessListScreenState();
}

class _BusinessListScreenState extends State<BusinessListScreen> {
  final ApiService _apiService = ApiService();
  List<Business> _businesses = [];
  List<Business> _filteredBusinesses = [];
  bool _isLoading = true;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadBusinesses();
  }

  Future<void> _loadBusinesses() async {
    try {
      final businessesData = await _apiService.getBusinesses();
      setState(() {
        _businesses = businessesData.map((json) => Business.fromJson(json)).toList();
        _filteredBusinesses = _businesses;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('İşletmeler yüklenemedi: $e')),
      );
    }
  }

  void _filterBusinesses(String query) {
    setState(() {
      _searchQuery = query;
      if (query.isEmpty) {
        _filteredBusinesses = _businesses;
      } else {
        _filteredBusinesses = _businesses
            .where((business) =>
                business.name.toLowerCase().contains(query.toLowerCase()) ||
                (business.category?.toLowerCase().contains(query.toLowerCase()) ?? false))
            .toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('İşletmeler'),
        actions: [
          if (authProvider.isLoggedIn) ...[
            IconButton(
              icon: Icon(Icons.calendar_today),
              onPressed: () {
                Navigator.pushNamed(context, '/appointments');
              },
            ),
            PopupMenuButton<String>(
              icon: Icon(Icons.account_circle),
              onSelected: (value) {
                if (value == 'logout') {
                  authProvider.logout();
                  Navigator.pushReplacementNamed(context, '/welcome');
                } else if (value == 'profile') {
                  // TODO: Profile screen
                }
              },
              itemBuilder: (context) => [
                PopupMenuItem(
                  value: 'profile',
                  child: Row(
                    children: [
                      Icon(Icons.person, color: Colors.black),
                      SizedBox(width: 12),
                      Text('Profilim'),
                    ],
                  ),
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
          ] else ...[
            TextButton(
              onPressed: () {
                Navigator.pushNamed(context, '/login');
              },
              child: Text('Giriş Yap', style: TextStyle(color: Colors.white)),
            ),
          ],
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Container(
            padding: EdgeInsets.all(16),
            color: Colors.white,
            child: TextField(
              onChanged: _filterBusinesses,
              decoration: InputDecoration(
                hintText: 'İşletme veya kategori ara...',
                prefixIcon: Icon(Icons.search, color: Colors.grey),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: Icon(Icons.clear, color: Colors.grey),
                        onPressed: () {
                          _filterBusinesses('');
                        },
                      )
                    : null,
                filled: true,
                fillColor: Colors.grey[50],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),

          // Business List
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator())
                : _filteredBusinesses.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.business, size: 64, color: Colors.grey),
                            SizedBox(height: 16),
                            Text(
                              _searchQuery.isEmpty
                                  ? 'Henüz işletme yok'
                                  : 'Sonuç bulunamadı',
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadBusinesses,
                        child: ListView.builder(
                          padding: EdgeInsets.all(16),
                          itemCount: _filteredBusinesses.length,
                          itemBuilder: (context, index) {
                            final business = _filteredBusinesses[index];
                            return _buildBusinessCard(business);
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildBusinessCard(Business business) {
    return Card(
      margin: EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          Navigator.pushNamed(
            context,
            '/services',
            arguments: business,
          );
        },
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Row(
            children: [
              // Business Logo
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  image: DecorationImage(
                    image: NetworkImage(business.logoUrl),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              SizedBox(width: 16),

              // Business Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      business.name,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      business.category ?? 'İşletme',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                    SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(Icons.star, size: 16, color: Colors.amber),
                        SizedBox(width: 4),
                        Text(
                          business.rating?.toStringAsFixed(1) ?? '0.0',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        if (business.workingHours != null) ...[
                          SizedBox(width: 16),
                          Icon(Icons.access_time, size: 16, color: Colors.grey),
                          SizedBox(width: 4),
                          Text(
                            business.workingHours!,
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ],
                    ),
                    if (business.address != null) ...[
                      SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.location_on, size: 16, color: Colors.grey),
                          SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              business.address!,
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),

              // Arrow Icon
              Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }
}
