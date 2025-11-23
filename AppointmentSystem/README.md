# 🏥 Appointment Management System - Randevu Yönetim Sistemi

**Öğrenci:** Furkan YILMAZ  
**Proje Başlangıç:** Kasım 2025  
**İlk Gösterim:** 17 Kasım 2025  
**Teknoloji:** ASP.NET Core 9.0 Web API  

---

## 📌 Proje Hakkında

Bu proje, çok işletmeli (multi-tenant) bir randevu yönetim sistemidir. Berber, kuaför, güzellik merkezi, nail artist, dövmeci, masaj salonu gibi randevu bazlı çalışan **tüm işletme türleri** için kullanılabilir.

### 🎯 Projenin Amacı

Kullanıcıların farklı işletmelerden hizmet seçip randevu oluşturabildiği, işletme sahiplerinin ise randevuları yönetebilidiği bir platform geliştirmek.

---

## ✅ PROJE DURUMU (16 Kasım 2025)

### 1️⃣ Tasarım - %100 Tamamlandı ✓

- **Frontend Framework:** Next.js 15 (React)
- **Styling:** Tailwind CSS
- **Sayfalar:**
  - ✅ Login/Register sayfaları
  - ✅ İşletmeler listesi
  - ✅ Hizmetler sayfası
  - ✅ Randevu oluşturma (takvim entegreli)
  - ✅ Kullanıcı randevuları listesi
  - ✅ Admin dashboard
  - ✅ Admin randevu yönetimi
- **Responsive:** Mobil, tablet, desktop uyumlu
- **Durum:** Tüm UI bileşenleri tamamlandı ve çalışıyor

### 2️⃣ Veritabanı - %100 Tamamlandı ✓

- **Veritabanı:** PostgreSQL 16 (Docker container)
- **Connection String:** Başarıyla bağlandı
- **Tablolar:**
  - ✅ Users (Kullanıcılar)
  - ✅ Businesses (İşletmeler)
  - ✅ Services (Hizmetler)
  - ✅ Appointments (Randevular)
- **İlişkiler:** Foreign key constraints uygulandı
- **Migration:** 3 adet migration başarıyla uygulandı
- **Test Data:** Seed data ile örnek veriler eklendi
- **Durum:** Veritabanı tamamen çalışıyor, tüm CRUD operasyonları test edildi

### 3️⃣ API - %100 Tamamlandı ✓

- **Framework:** ASP.NET Core 9.0 Web API
- **Mimari:** Controller-Service-Repository Pattern
- **Endpoint'ler:**
  - ✅ Auth Controller (Login, Register)
  - ✅ Business Controller (CRUD)
  - ✅ Service Controller (CRUD)
  - ✅ Appointment Controller (CRUD, Approve, Reject, Cancel)
- **Authentication:** JWT Bearer Token
- **Authorization:** Role-based (Admin, Customer)
- **Validation:** DTO validation
- **Error Handling:** Global exception middleware
- **Documentation:** Swagger UI
- **Port:** http://localhost:5025
- **Durum:** Tüm API endpoint'leri çalışıyor ve test edildi

### 4️⃣ API Kullanımı - %100 Tamamlandı ✓

- **HTTP Client:** Axios
- **API Servisleri:**
  - ✅ Auth Service (login, register)
  - ✅ Business Service (getBusinesses)
  - ✅ Service Service (getServices)
  - ✅ Appointment Service (create, get, cancel, approve, reject)
- **Token Management:** localStorage ile JWT saklama
- **Protected Routes:** Token gerektiren sayfalar
- **Durum:** Frontend-Backend entegrasyonu %100 çalışıyor

---

## 🛠 Kullanılan Teknolojiler

### Backend (.NET)
- **ASP.NET Core 9.0** - Web API Framework
- **Entity Framework Core 9.0.0** - ORM (Object-Relational Mapping)
- **PostgreSQL 16** - İlişkisel Veritabanı
- **Npgsql 9.0.0** - PostgreSQL provider
- **JWT Bearer 9.0.0** - Token bazlı kimlik doğrulama
- **BCrypt.Net 0.1.0** - Şifre hash'leme
- **Swashbuckle 7.0.0** - API dokümantasyonu (Swagger)

### Frontend (Next.js)
- **Next.js 15.0.3** - React Framework
- **React 19** - UI Library
- **Tailwind CSS 3.4.1** - CSS Framework
- **Axios 1.7.8** - HTTP Client
- **JWT Decode 4.0.0** - Token çözümleme
- **React Calendar 5.1.0** - Takvim bileşeni

---

## � Kurulum ve Çalıştırma

### 1. Gereksinimler
- .NET 9.0 SDK
- PostgreSQL 16 (Docker ile çalışıyor)
- Visual Studio Code veya Visual Studio 2022

### 2. Projeyi Klonlama
```bash
git clone <repository-url>
cd AppointmentSystem
```

### 3. PostgreSQL Docker Container Başlatma
```bash
docker run --name postgres-appointment \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=appointmentdb \
  -p 5432:5432 \
  -d postgres:16
```

### 4. Veritabanı Migration
```bash
dotnet ef database update
```

### 5. Projeyi Çalıştırma
```bash
dotnet run
```

API: http://localhost:5025  
Swagger UI: http://localhost:5025/swagger

---

## 📁 Proje Yapısı

```
AppointmentSystem/
├── Controllers/          # API Endpoint'leri
│   ├── AuthController.cs       # Giriş/Kayıt
│   ├── BusinessController.cs   # İşletme yönetimi
│   ├── ServiceController.cs    # Hizmet yönetimi
│   └── AppointmentController.cs # Randevu yönetimi
├── Models/              # Veritabanı Modelleri
│   ├── User.cs                 # Kullanıcı modeli
│   ├── Business.cs             # İşletme modeli
│   ├── Service.cs              # Hizmet modeli
│   └── Appointment.cs          # Randevu modeli
├── DTOs/                # Data Transfer Objects
│   ├── Auth/                   # Login/Register DTO'ları
│   ├── Business/               # Business DTO'ları
│   ├── Service/                # Service DTO'ları
│   └── Appointment/            # Appointment DTO'ları
├── Services/            # Business Logic
│   ├── AuthService.cs          # Kimlik doğrulama servisi
│   ├── BusinessService.cs      # İşletme servisi
│   ├── ServiceService.cs       # Hizmet servisi
│   └── AppointmentService.cs   # Randevu servisi
├── Data/                # Veritabanı Context
│   └── AppDbContext.cs         # EF Core DbContext
├── Migrations/          # Veritabanı Migrations
└── Program.cs           # Uygulama Başlangıcı
```

---

## 🗄️ Veritabanı Şeması

### Users Tablosu
```sql
CREATE TABLE Users (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(20) NOT NULL, -- 'Customer' veya 'Admin'
    PhoneNumber VARCHAR(20),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Businesses Tablosu
```sql
CREATE TABLE Businesses (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Address VARCHAR(255),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(100),
    OwnerId INT REFERENCES Users(Id),
    OpeningTime TIME NOT NULL,
    ClosingTime TIME NOT NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Services Tablosu
```sql
CREATE TABLE Services (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10,2) NOT NULL,
    Duration INT NOT NULL, -- dakika cinsinden
    BusinessId INT REFERENCES Businesses(Id) ON DELETE CASCADE,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Appointments Tablosu
```sql
CREATE TABLE Appointments (
    Id SERIAL PRIMARY KEY,
    CustomerId INT REFERENCES Users(Id),
    ServiceId INT REFERENCES Services(Id),
    BusinessId INT REFERENCES Businesses(Id),
    AppointmentDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    Status VARCHAR(20) DEFAULT 'Pending',
    Notes TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**İlişkiler:**
- User → Appointments (1:N) - Bir kullanıcı birden fazla randevu alabilir
- Business → Services (1:N) - Bir işletme birden fazla hizmet verebilir
- Business → Appointments (1:N) - Bir işletmede birden fazla randevu olabilir
- Service → Appointments (1:N) - Bir hizmet için birden fazla randevu oluşturulabilir

---

## 🔐 Authentication & Authorization

### JWT Token Yapısı
```json
{
  "userId": "1",
  "email": "user@example.com",
  "role": "Customer",
  "exp": 1732456789
}
```

### Roller
- **Customer:** Normal kullanıcı (randevu oluşturma, görüntüleme, iptal)
- **Admin:** İşletme sahibi (tüm randevuları görme, onaylama, reddetme)

### API Request'lerde Token Kullanımı
```bash
# Header'a token ekleme
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📚 API Endpoints Detayları

### 🔐 Auth Controller

**POST** `/api/auth/register` - Yeni Kullanıcı Kaydı
```json
Request:
{
  "name": "Furkan Yılmaz",
  "email": "furkan@example.com",
  "password": "Sifre123!",
  "phoneNumber": "05551234567"
}

Response: (201 Created)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Furkan Yılmaz",
    "email": "furkan@example.com",
    "role": "Customer"
  }
}
```

**POST** `/api/auth/login` - Giriş Yap
```json
Request:
{
  "email": "furkan@example.com",
  "password": "Sifre123!"
}

Response: (200 OK)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Furkan Yılmaz",
    "email": "furkan@example.com",
    "role": "Customer"
  }
}
```

---

### 🏢 Business Controller

**GET** `/api/businesses` - Tüm İşletmeleri Listele
```json
Response: (200 OK)
[
  {
    "id": 1,
    "name": "Elite Berber",
    "description": "Profesyonel erkek kuaförü",
    "address": "İstanbul, Kadıköy",
    "phoneNumber": "05551234567",
    "email": "info@eliteberber.com",
    "openingTime": "09:00:00",
    "closingTime": "19:00:00",
    "isActive": true
  }
]
```

**GET** `/api/businesses/{id}` - İşletme Detayı
```json
Response: (200 OK)
{
  "id": 1,
  "name": "Elite Berber",
  "services": [
    {
      "id": 1,
      "name": "Saç Kesimi",
      "price": 150.00,
      "duration": 30
    }
  ]
}
```

**POST** `/api/businesses` - Yeni İşletme Ekle *(Admin)*
```json
Request:
{
  "name": "Elite Berber",
  "description": "Profesyonel erkek kuaförü",
  "address": "İstanbul, Kadıköy",
  "phoneNumber": "05551234567",
  "email": "info@eliteberber.com",
  "openingTime": "09:00",
  "closingTime": "19:00"
}

Response: (201 Created)
{
  "id": 1,
  "name": "Elite Berber",
  ...
}
```

---

### 🛎️ Service Controller

**GET** `/api/services/business/{businessId}` - İşletmeye Ait Hizmetler
```json
Response: (200 OK)
[
  {
    "id": 1,
    "name": "Saç Kesimi",
    "description": "Profesyonel saç kesimi",
    "price": 150.00,
    "duration": 30,
    "businessId": 1,
    "isActive": true
  }
]
```

**POST** `/api/services` - Yeni Hizmet Ekle *(Admin)*
```json
Request:
{
  "name": "Saç Kesimi",
  "description": "Profesyonel saç kesimi",
  "price": 150.00,
  "duration": 30,
  "businessId": 1
}

Response: (201 Created)
{
  "id": 1,
  "name": "Saç Kesimi",
  ...
}
```

**DELETE** `/api/services/{id}` - Hizmet Sil *(Admin)*
```json
Response: (204 No Content)
```

---

### 📅 Appointment Controller

**POST** `/api/appointments` - Randevu Oluştur *(Customer)*
```json
Request:
{
  "serviceId": 1,
  "businessId": 1,
  "appointmentDate": "2025-11-20",
  "startTime": "14:00",
  "endTime": "14:30",
  "notes": "Sakal kesimi de istiyorum"
}

Response: (201 Created)
{
  "id": 1,
  "service": "Saç Kesimi",
  "business": "Elite Berber",
  "appointmentDate": "2025-11-20",
  "startTime": "14:00",
  "status": "Pending"
}
```

**GET** `/api/appointments/user/{userId}` - Kullanıcının Randevuları
```json
Response: (200 OK)
[
  {
    "id": 1,
    "serviceName": "Saç Kesimi",
    "businessName": "Elite Berber",
    "appointmentDate": "2025-11-20T14:00:00",
    "startTime": "14:00",
    "endTime": "14:30",
    "status": "Approved",
    "notes": "Sakal kesimi de istiyorum"
  }
]
```

**GET** `/api/appointments/business/{businessId}` - İşletmenin Randevuları *(Admin)*
```json
Response: (200 OK)
[
  {
    "id": 1,
    "customerName": "Furkan Yılmaz",
    "serviceName": "Saç Kesimi",
    "appointmentDate": "2025-11-20",
    "startTime": "14:00",
    "status": "Pending"
  }
]
```

**PUT** `/api/appointments/{id}/approve` - Randevu Onayla *(Admin)*
```json
Response: (200 OK)
{
  "id": 1,
  "status": "Approved"
}
```

**PUT** `/api/appointments/{id}/reject` - Randevu Reddet *(Admin)*
```json
Response: (200 OK)
{
  "id": 1,
  "status": "Rejected"
}
```

**DELETE** `/api/appointments/{id}` - Randevu İptal Et
```json
Response: (204 No Content)
```

**GET** `/api/appointments/available-slots` - Müsait Saatleri Getir
```json
Request Query Parameters:
?businessId=1&serviceId=1&date=2025-11-20

Response: (200 OK)
{
  "availableSlots": [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    ...
  ]
}
```

---

## 🎨 Frontend Entegrasyonu

### API Service (Next.js)
```javascript
// lib/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5025/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token'ı her istekte ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  register: (name, email, password, phoneNumber) => 
    api.post('/auth/register', { name, email, password, phoneNumber }),
};

export const businessAPI = {
  getAll: () => api.get('/businesses'),
  getById: (id) => api.get(`/businesses/${id}`),
};

export const serviceAPI = {
  getByBusiness: (businessId) => 
    api.get(`/services/business/${businessId}`),
};

export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getUserAppointments: (userId) => 
    api.get(`/appointments/user/${userId}`),
  cancel: (id) => api.delete(`/appointments/${id}`),
  approve: (id) => api.put(`/appointments/${id}/approve`),
  reject: (id) => api.put(`/appointments/${id}/reject`),
  getAvailableSlots: (businessId, serviceId, date) => 
    api.get('/appointments/available-slots', {
      params: { businessId, serviceId, date }
    }),
};
```

### Kullanım Örneği
```javascript
// Login işlemi
const handleLogin = async () => {
  try {
    const response = await authAPI.login(email, password);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    router.push('/businesses');
  } catch (error) {
    console.error('Login error:', error);
  }
};

// Randevu oluşturma
const createAppointment = async () => {
  try {
    const data = {
      serviceId: 1,
      businessId: 1,
      appointmentDate: '2025-11-20',
      startTime: '14:00',
      endTime: '14:30'
    };
    await appointmentAPI.create(data);
    alert('Randevu oluşturuldu!');
  } catch (error) {
    console.error('Appointment error:', error);
  }
};
```

---
|----------|--------|----------|
| `/api/admin/appointments` | GET | Tüm randevuları listele (filtreleme) |
| `/api/admin/appointments/{id}/approve` | PUT | Randevu onayla |
| `/api/admin/appointments/{id}/reject` | PUT | Randevu reddet |
| `/api/admin/appointments/{id}` | DELETE | Randevu sil |

#### Filtreleme Parametreleri:
- `dateFrom`: Başlangıç tarihi
- `dateTo`: Bitiş tarihi
- `serviceId`: Servis ID
- `status`: Durum (Pending, Approved, Rejected, Cancelled, Completed)

Örnek: `/api/admin/appointments?status=Pending&dateFrom=2025-11-01`

## 🔑 JWT Kullanımı

API'ye istek yaparken header'a token ekleyin:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### cURL Örneği:
```bash
curl -X GET "https://localhost:5001/api/services" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 👥 Roller

### Customer (Müşteri)
- Servisleri görüntüleyebilir
- Randevu talebi oluşturabilir
- Kendi randevularını görüntüleyebilir
- Kendi randevularını iptal edebilir

### Admin (İşletme/Yönetici)
- Tüm Customer yetkilerine sahip
- Servisleri yönetebilir (ekle, güncelle)
- Tüm randevuları görüntüleyebilir
- Randevuları onaylayabilir/reddedebilir
- Randevuları silebilir

## 📊 Randevu Durumları

- **Pending**: Onay bekliyor
- **Approved**: Onaylandı
- **Rejected**: Reddedildi
- **Cancelled**: İptal edildi (kullanıcı tarafından)
- **Completed**: Tamamlandı

## 🧪 Test

### Admin Kullanıcı Oluşturma

Veritabanına manuel olarak admin kullanıcı ekleyin:

```sql
INSERT INTO users (full_name, email, password_hash, role, created_at, updated_at)
VALUES (
  'Admin User',
  'admin@example.com',
  '$2a$11$hashed_password_here',  -- BCrypt hash
  1,  -- 1 = Admin
  NOW(),
  NOW()
);
```

Veya kod içinde role'ü manuel güncelleyin.

## 🔒 Güvenlik

- Şifreler BCrypt ile hash'lenir
---

## 🧪 TEST ETME

### Swagger UI ile Test

1. Uygulamayı başlatın:
```bash
dotnet run
```

2. Tarayıcıda açın:
```
http://localhost:5025/swagger
```

3. **Register** endpoint'ini test edin
4. Dönen **token**'ı kopyalayın
5. Sağ üstteki **Authorize** butonuna tıklayın
6. `Bearer <token>` formatında yapıştırın
7. Diğer endpoint'leri test edin

### Postman ile Test

**Environment Variables:**
```json
{
  "baseUrl": "http://localhost:5025/api",
  "token": ""
}
```

**Test Adımları:**
1. Register → Token al
2. Token'ı environment variable'a kaydet
3. Businesses listesini çek
4. Service seç
5. Appointment oluştur
6. Admin login yap
7. Appointment'ı onayla/reddet

---

## 🔒 GÜVENLİK

### Uygulanan Güvenlik Önlemleri

✅ **Şifre Güvenliği**
- BCrypt ile hash'leme
- Salt otomatik eklenir
- Plain text şifre asla saklanmaz

✅ **Authentication**
- JWT Bearer Token
- Token expiration (24 saat)
- Secure token generation

✅ **Authorization**
- Role-based access control
- Customer/Admin rolleri
- Protected endpoints

✅ **Database**
- SQL Injection koruması (EF Core parametrize eder)
- Foreign key constraints
- Unique constraints

✅ **CORS**
- Configured origins
- Production'da whitelist

### Production İçin Öneriler

🔐 **appsettings.Production.json**
```json
{
  "JwtSettings": {
    "SecretKey": "Use-Very-Strong-Random-Key-Here",
    "ExpiryMinutes": "60"
  },
  "AllowedOrigins": ["https://yourdomain.com"]
}
```

🔐 **HTTPS Zorunluluğu**
```csharp
app.UseHttpsRedirection();
```

🔐 **Rate Limiting** (Gelecek özellik)
```csharp
builder.Services.AddRateLimiter(...);
```

---

## 🚀 DEPLOYMENT

### Docker ile Çalıştırma

**Dockerfile:**
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5025

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["AppointmentSystem.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AppointmentSystem.dll"]
```

**Docker Compose:**
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5025:5025"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Host=db;Port=5432;Database=appointmentdb;Username=postgres;Password=postgres
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=appointmentdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Çalıştırma:**
```bash
docker-compose up -d
```

---

## � PERFORMANS

### Database Indexleme

```csharp
// Email unique index
entity.HasIndex(e => e.Email).IsUnique();

// Appointment date index (Hızlı tarih sorguları için)
entity.HasIndex(e => e.AppointmentDate);

// Business + Date composite index
entity.HasIndex(e => new { e.BusinessId, e.AppointmentDate });
```

### Query Optimization

```csharp
// ✅ DOĞRU - Eager Loading
var businesses = await _context.Businesses
    .Include(b => b.Services)
    .ToListAsync();

// ❌ YANLIŞ - N+1 Problem
var businesses = await _context.Businesses.ToListAsync();
foreach (var business in businesses)
{
    var services = await _context.Services
        .Where(s => s.BusinessId == business.Id)
        .ToListAsync();
}
```

### Caching (Gelecek özellik)

```csharp
builder.Services.AddMemoryCache();
builder.Services.AddDistributedMemoryCache();
```

---

## 📚 KAYNAKLAR

### Kullanılan Teknolojiler

- [ASP.NET Core 9.0](https://docs.microsoft.com/aspnet/core) - Web API Framework
- [Entity Framework Core 9.0](https://docs.microsoft.com/ef/core) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Veritabanı
- [JWT](https://jwt.io/) - Authentication
- [BCrypt](https://github.com/BcryptNet/bcrypt.net) - Password Hashing
- [Swagger](https://swagger.io/) - API Documentation

### Öğrenme Kaynakları

- [Microsoft Learn - ASP.NET Core](https://learn.microsoft.com/aspnet/core)
- [Entity Framework Core Docs](https://learn.microsoft.com/ef/core)
- [REST API Best Practices](https://restfulapi.net/)
- [JWT.io - Introduction](https://jwt.io/introduction)

---

## 🐛 TROUBLESHOOTING

### PostgreSQL Bağlantı Hatası

**Problem:** `Could not connect to PostgreSQL`

**Çözüm:**
```bash
# Docker container kontrol et
docker ps | grep postgres

# Çalışmıyorsa başlat
docker start postgres-appointment

# Log'ları kontrol et
docker logs postgres-appointment
```

### Migration Hatası

**Problem:** `The entity type 'User' requires a primary key to be defined`

**Çözüm:**
```bash
# Migration'ı sil ve yeniden oluştur
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### JWT Token Hatası

**Problem:** `401 Unauthorized` hatası

**Çözüm:**
1. Token'ı kopyaladınız mı?
2. `Bearer ` prefix'i eklediniz mi?
3. Token süresi dolmadı mı? (24 saat)
4. SecretKey aynı mı?

### CORS Hatası

**Problem:** `Access to fetch at 'http://localhost:5025' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Çözüm:**
```csharp
// Program.cs'de CORS eklediğinizden emin olun
app.UseCors("AllowAll");
```

---

## 🐳 DOCKER İLE ÇALIŞTIRMA (ÖNERİLEN)

### Hızlı Başlangıç - Tek Komut

Tüm sistemi (Frontend + Backend + Database) tek komutla çalıştırın:

```bash
cd /Users/furkanyilmaz/Desktop/appointment
docker-compose up
```

Bu komut şunları yapar:
- ✅ PostgreSQL veritabanını başlatır
- ✅ .NET Backend API'yi çalıştırır
- ✅ Next.js Frontend'i çalıştırır

**Erişim URL'leri:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5025
- Swagger Docs: http://localhost:5025/swagger

**Durdurma:**
```bash
docker-compose down
```

**Detaylı Docker kullanımı için:** [DOCKER_KULLANIM.md](../DOCKER_KULLANIM.md) dosyasına bakın.

---

## 💻 MANUEL KURULUM (Alternatif)

### 1. Gereksinimler
- .NET 9.0 SDK
- PostgreSQL 16 (Docker ile çalışıyor)
- Visual Studio Code veya Visual Studio 2022

### 2. Projeyi Klonlama
```bash
git clone <repository-url>
cd AppointmentSystem
```

### 3. PostgreSQL Docker Container Başlatma
```bash
docker run --name postgres-appointment \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=appointmentdb \
  -p 5432:5432 \
  -d postgres:16
```

### 4. Veritabanı Migration
```bash
dotnet ef database update
```

### 5. Projeyi Çalıştırma
```bash
dotnet run
```

API: http://localhost:5025  
Swagger UI: http://localhost:5025/swagger

---

## 📁 GELECEK ÖZELLIKLER



## 🎯 PROJE TAMAMLANMA DURUMU

| Özellik | Durum | Açıklama |
|---------|-------|----------|
| Tasarım | ✅ %100 | Next.js frontend tamamlandı |
| Veritabanı | ✅ %100 | PostgreSQL, 4 tablo, ilişkiler |
| API | ✅ %100 | Tüm endpoint'ler çalışıyor |
| Authentication | ✅ %100 | JWT token sistemi |
| Authorization | ✅ %100 | Role-based erişim |
| Frontend-Backend | ✅ %100 | Tam entegrasyon |
| Test | ✅ %100 | Swagger ve Postman test edildi |
| Documentation | ✅ %100 | README ve kod açıklamaları |
| Docker | ✅ %100 | docker-compose ile tek komut çalıştırma |
| Deployment | ✅ %100 | Production ready |

---

## 📞 İLETİŞİM

**Öğrenci:** Furkan YILMAZ  
**Tarih:** 16 Kasım 2025  

---

