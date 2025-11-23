# 📊 PROJE ÖZETİ - İLK GÖSTERIM

**Öğrenci Adı:** Furkan YILMAZ  
**Tarih:** 16 Kasım 2025  
**Ders:** .NET Programlama  
**Proje:** Appointment Management System (Randevu Yönetim Sistemi)

---

## 🎯 PROJE TANIMI

Çok işletmeli (multi-tenant) randevu yönetim sistemi. Berber, kuaför, güzellik merkezi gibi hizmet sektörü işletmeleri için geliştirilmiş web uygulaması.

### Temel İşlevler

1. **Kullanıcılar:** İşletmeleri görüntüleyebilir, hizmet seçebilir, randevu alabilir
2. **İşletme Sahipleri:** Randevuları onaylayabilir, reddedebilir, yönetebilir
3. **Sistem:** Çakışan randevuları engeller, uygun saatleri gösterir

---

## ✅ TAMAMLANAN ÇALIŞMALAR

### 1. TASARIM (%100 TAMAMLANDI) ✓

**Frontend Teknolojisi:** Next.js 15 + React 19 + Tailwind CSS

**Tamamlanan Sayfalar:**
- ✅ Login Sayfası (Kullanıcı girişi)
- ✅ Register Sayfası (Yeni kayıt)
- ✅ İşletmeler Listesi (Card layout, responsive)
- ✅ Hizmetler Sayfası (Seçilen işletmenin hizmetleri)
- ✅ Randevu Oluşturma (Takvim entegreli, saat seçimi)
- ✅ Kullanıcı Randevularım Sayfası (Liste, iptal)
- ✅ Admin Dashboard (İstatistikler, pending randevular)
- ✅ Admin Randevu Yönetimi (Onaylama, reddetme, tüm liste)

**Ekran Görüntüleri:**
- Modern, temiz tasarım
- Responsive (Mobil, tablet, desktop uyumlu)
- Dark mode button'lar
- Loading states
- Error handling
- Success/Error toast notifications

**Demo URL:** http://localhost:3000

---

### 2. VERİTABANI (%100 TAMAMLANDI) ✓

**Veritabanı:** PostgreSQL 16 (Docker container)

**Bağlantı Bilgileri:**
```
Host: localhost
Port: 5432
Database: appointmentdb
Username: postgres
Password: postgres
```

**Tablolar ve İlişkiler:**

#### Users Tablosu (4 alan, 1 index)
```sql
- Id (Primary Key, Auto Increment)
- Name (VARCHAR(100), NOT NULL)
- Email (VARCHAR(100), UNIQUE, NOT NULL)
- PasswordHash (VARCHAR(255), NOT NULL)
- Role (VARCHAR(20), DEFAULT 'Customer')
- PhoneNumber (VARCHAR(20))
- CreatedAt (TIMESTAMP)
```

#### Businesses Tablosu (11 alan, 1 FK)
```sql
- Id (Primary Key)
- Name (VARCHAR(100), NOT NULL)
- Description (TEXT)
- Address (VARCHAR(255))
- PhoneNumber (VARCHAR(20))
- Email (VARCHAR(100))
- OwnerId (Foreign Key → Users.Id)
- OpeningTime (TIME)
- ClosingTime (TIME)
- IsActive (BOOLEAN, DEFAULT TRUE)
- CreatedAt (TIMESTAMP)
```

#### Services Tablosu (8 alan, 1 FK)
```sql
- Id (Primary Key)
- Name (VARCHAR(100), NOT NULL)
- Description (TEXT)
- Price (DECIMAL(10,2), NOT NULL)
- Duration (INT, NOT NULL) -- Dakika cinsinden
- BusinessId (Foreign Key → Businesses.Id)
- IsActive (BOOLEAN, DEFAULT TRUE)
- CreatedAt (TIMESTAMP)
```

#### Appointments Tablosu (10 alan, 3 FK)
```sql
- Id (Primary Key)
- CustomerId (Foreign Key → Users.Id)
- ServiceId (Foreign Key → Services.Id)
- BusinessId (Foreign Key → Businesses.Id)
- AppointmentDate (DATE, NOT NULL)
- StartTime (TIME, NOT NULL)
- EndTime (TIME, NOT NULL)
- Status (VARCHAR(20), DEFAULT 'Pending')
- Notes (TEXT)
- CreatedAt (TIMESTAMP)
```

**İlişkiler:**
- User (1) → Appointments (N)
- Business (1) → Services (N)
- Business (1) → Appointments (N)
- Service (1) → Appointments (N)

**Migration Durumu:**
- ✅ InitialCreate migration uygulandı
- ✅ Seed data eklendi (3 business, 9 service, örnek randevular)
- ✅ Foreign key constraints aktif
- ✅ Unique constraints aktif (Email)

**Test Verileri:**
```sql
-- 3 İşletme eklendi
Elite Berber, Beauty Salon, Nail Art Studio

-- 9 Hizmet eklendi
Saç Kesimi, Sakal Kesimi, Manikür, Pedikür, vb.

-- Örnek randevular oluşturuldu
```

**Veritabanı Kontrolü:**
```bash
# Docker container çalışıyor mu?
docker ps | grep postgres
✅ postgres-appointment container aktif

# Bağlantı test
psql -h localhost -U postgres -d appointmentdb
✅ Başarılı bağlantı
```

---

### 3. API (%100 TAMAMLANDI) ✓

**Backend Teknolojisi:** ASP.NET Core 9.0 Web API

**Port:** http://localhost:5025  
**Swagger:** http://localhost:5025/swagger

**Controller'lar ve Endpoint'ler:**

#### 🔐 AuthController
- ✅ `POST /api/auth/register` - Yeni kullanıcı kaydı
- ✅ `POST /api/auth/login` - Giriş yap (JWT token al)

#### 🏢 BusinessController
- ✅ `GET /api/businesses` - Tüm işletmeleri listele
- ✅ `GET /api/businesses/{id}` - İşletme detayı
- ✅ `POST /api/businesses` - Yeni işletme ekle *(Admin)*
- ✅ `PUT /api/businesses/{id}` - İşletme güncelle *(Admin)*
- ✅ `DELETE /api/businesses/{id}` - İşletme sil *(Admin)*

#### 🛎️ ServiceController
- ✅ `GET /api/services/business/{businessId}` - İşletmenin hizmetleri
- ✅ `GET /api/services/{id}` - Hizmet detayı
- ✅ `POST /api/services` - Yeni hizmet ekle *(Admin)*
- ✅ `PUT /api/services/{id}` - Hizmet güncelle *(Admin)*
- ✅ `DELETE /api/services/{id}` - Hizmet sil *(Admin)*

#### 📅 AppointmentController
- ✅ `POST /api/appointments` - Randevu oluştur *(Customer)*
- ✅ `GET /api/appointments/user/{userId}` - Kullanıcının randevuları
- ✅ `GET /api/appointments/business/{businessId}` - İşletme randevuları *(Admin)*
- ✅ `GET /api/appointments/available-slots` - Müsait saatler
- ✅ `PUT /api/appointments/{id}/approve` - Randevu onayla *(Admin)*
- ✅ `PUT /api/appointments/{id}/reject` - Randevu reddet *(Admin)*
- ✅ `DELETE /api/appointments/{id}` - Randevu iptal et

**Toplam:** 20 endpoint

**Özellikler:**
- ✅ JWT Authentication (Token bazlı güvenlik)
- ✅ Role-based Authorization (Customer/Admin)
- ✅ BCrypt Password Hashing (Şifre güvenliği)
- ✅ CORS Configuration (Frontend entegrasyonu için)
- ✅ Swagger Documentation (API dokümantasyonu)
- ✅ Error Handling (Hata yönetimi)
- ✅ Validation (DTO validation)

**Test Edildi:**
```bash
# Swagger ile test
✅ Tüm endpoint'ler çalışıyor

# Postman ile test
✅ Collection oluşturuldu
✅ Tüm senaryolar test edildi
```

---

### 4. API KULLANIMI (%100 TAMAMLANDI) ✓

**Frontend API Servisi:** `lib/api.js`

**Entegre Edilmiş Servisler:**

```javascript
// ✅ Auth API
- login(email, password)
- register(name, email, password, phoneNumber)

// ✅ Business API
- getAll()
- getById(id)

// ✅ Service API
- getByBusiness(businessId)

// ✅ Appointment API
- create(data)
- getUserAppointments(userId)
- getBusinessAppointments(businessId)
- cancel(id)
- approve(id)
- reject(id)
- getAvailableSlots(businessId, serviceId, date)
```

**Token Yönetimi:**
```javascript
// Token localStorage'da saklanıyor
localStorage.setItem('token', token)

// Her istekte otomatik ekleniyor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
});
```

**Çalışan Senaryolar:**

1. **Kullanıcı Kaydı Flow:**
```
Register → Token al → localStorage'a kaydet → Businesses sayfasına yönlendir
✅ ÇALIŞIYOR
```

2. **Login Flow:**
```
Login → Token al → Role kontrolü → Customer: Businesses / Admin: Dashboard
✅ ÇALIŞIYOR
```

3. **Randevu Oluşturma Flow:**
```
İşletme seç → Hizmet seç → Tarih seç → Müsait saatleri getir → Saat seç → Randevu oluştur
✅ ÇALIŞIYOR
```

4. **Admin Onaylama Flow:**
```
Pending randevuları listele → Randevu seç → Onayla/Reddet → Status güncelle
✅ ÇALIŞIYOR
```

**Network İstekleri (Browser DevTools):**
```
✅ POST /api/auth/login → 200 OK
✅ GET /api/businesses → 200 OK
✅ GET /api/services/business/1 → 200 OK
✅ POST /api/appointments → 201 Created
✅ GET /api/appointments/user/1 → 200 OK
✅ PUT /api/appointments/1/approve → 200 OK
```

---

## 🛠️ KULLANILAN TEKNOLOJİLER

### Backend Stack
| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| .NET Core | 9.0 | Web API Framework |
| C# | 12.0 | Programlama Dili |
| Entity Framework Core | 9.0.0 | ORM (Database işlemleri) |
| PostgreSQL | 16 | İlişkisel Veritabanı |
| Npgsql | 9.0.0 | PostgreSQL Provider |
| JWT Bearer | 9.0.0 | Authentication |
| BCrypt.Net | 0.1.0 | Password Hashing |
| Swashbuckle | 7.0.0 | API Documentation |

### Frontend Stack
| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| Next.js | 15.0.3 | React Framework |
| React | 19 | UI Library |
| Tailwind CSS | 3.4.1 | Styling |
| Axios | 1.7.8 | HTTP Client |
| JWT Decode | 4.0.0 | Token Parsing |
| React Calendar | 5.1.0 | Date Picker |

### Development Tools
- Docker Desktop (PostgreSQL container)
- Visual Studio Code
- Postman (API Testing)
- Git & GitHub

---

## 📂 PROJE YAPISI

```
appointment/
├── AppointmentSystem/          # .NET Backend
│   ├── Controllers/           # API Endpoints
│   │   ├── AuthController.cs
│   │   ├── BusinessController.cs
│   │   ├── ServiceController.cs
│   │   └── AppointmentController.cs
│   ├── Models/                # Database Models
│   │   ├── User.cs
│   │   ├── Business.cs
│   │   ├── Service.cs
│   │   └── Appointment.cs
│   ├── DTOs/                  # Data Transfer Objects
│   │   ├── Auth/
│   │   ├── Business/
│   │   ├── Service/
│   │   └── Appointment/
│   ├── Services/              # Business Logic
│   │   ├── AuthService.cs
│   │   ├── BusinessService.cs
│   │   ├── ServiceService.cs
│   │   └── AppointmentService.cs
│   ├── Data/                  # Database Context
│   │   └── AppDbContext.cs
│   ├── Migrations/            # EF Migrations
│   ├── Program.cs             # App Entry Point
│   ├── README.md              # Proje dokümantasyonu
│   └── KOD_ACIKLAMASI.md      # Kod açıklamaları
│
└── appointment-frontend/       # Next.js Frontend
    ├── app/                   # Next.js 15 App Router
    │   ├── login/
    │   ├── register/
    │   ├── businesses/
    │   ├── services/
    │   ├── booking/
    │   ├── appointments/
    │   └── admin/
    ├── components/            # React Components
    ├── lib/
    │   └── api.js            # API Service
    └── public/               # Static Files
```

---

## 🎓 ÖĞRENME SÜRECİ

### Karşılaşılan Zorluklar ve Çözümler

1. **PostgreSQL Docker Kurulumu**
   - Problem: Docker container başlatma
   - Çözüm: `docker run` komutu ile başarılı kurulum

2. **Entity Framework Migrations**
   - Problem: İlk migration hatası
   - Çözüm: `dotnet ef database update` ile düzeltildi

3. **CORS Hatası**
   - Problem: Frontend → Backend isteği blocked
   - Çözüm: Program.cs'de CORS policy eklendi

4. **JWT Token Kullanımı**
   - Problem: Token'ın header'a eklenmesi
   - Çözüm: Axios interceptor ile otomatikleştirildi

5. **Randevu Çakışma Kontrolü**
   - Problem: Aynı saate birden fazla randevu
   - Çözüm: LINQ query ile çakışma kontrolü eklendi

### Öğrendiklerim

✅ **Backend:**
- RESTful API tasarımı
- Entity Framework Core ORM kullanımı
- JWT Authentication & Authorization
- Repository pattern
- Dependency Injection
- Async/Await programming
- LINQ queries
- BCrypt password hashing

✅ **Database:**
- PostgreSQL kullanımı
- Foreign key relationships
- Database migrations
- Seed data
- Indexing

✅ **Frontend:**
- Next.js App Router
- React hooks (useState, useEffect)
- Axios HTTP istekleri
- Token yönetimi
- Responsive tasarım
- Tailwind CSS

---

## 📊 KOD İSTATİSTİKLERİ

### Backend (.NET)
```
Toplam Dosya: 35+
Controllers: 4
Services: 4
Models: 4
DTOs: 12+
Migrations: 3
Toplam Satır: ~3,000+
```

### Frontend (Next.js)
```
Toplam Dosya: 20+
Pages: 8
Components: 15+
Toplam Satır: ~2,500+
```

---

## 🧪 TEST SONUÇLARI

### Unit Testing
⚠️ Henüz implement edilmedi (Gelecek özellik)

### Integration Testing
✅ Tüm API endpoint'leri Swagger ile test edildi
✅ Frontend-Backend entegrasyonu çalışıyor
✅ Database CRUD işlemleri test edildi

### Manual Testing
✅ Kullanıcı kaydı çalışıyor
✅ Login çalışıyor
✅ İşletme listesi geliy or
✅ Hizmet listesi geliyor
✅ Randevu oluşturma çalışıyor
✅ Randevu listeleme çalışıyor
✅ Randevu onaylama çalışıyor
✅ Randevu reddetme çalışıyor
✅ Randevu iptal çalışıyor

---

## 🚀 NASIL ÇALIŞTIRILIR?

### Backend Başlatma

1. **PostgreSQL Başlat:**
```bash
docker start postgres-appointment
```

2. **.NET Projesini Çalıştır:**
```bash
cd AppointmentSystem
dotnet run
```

3. **Swagger'ı Aç:**
```
http://localhost:5025/swagger
```

### Frontend Başlatma

1. **Dependencies Yükle:**
```bash
cd appointment-frontend
npm install
```

2. **Dev Server Başlat:**
```bash
npm run dev
```

3. **Tarayıcıda Aç:**
```
http://localhost:3000
```

### Test Hesapları

**Admin:**
```
Email: admin@elite.com
Password: Admin123!
```

**Customer:**
```
Email: user@example.com
Password: User123!
```

---

## 📸 EKRAN GÖRÜNTÜLERİ

### 1. Login Sayfası
- Modern card tasarım
- Email/Password input
- Error handling
- Register linki

### 2. İşletmeler Listesi
- Grid layout (3 columns)
- İşletme kartları
- Adres, telefon, çalışma saatleri
- "Hizmetleri Gör" butonu

### 3. Hizmetler Sayfası
- Seçilen işletmenin hizmetleri
- Fiyat ve süre bilgisi
- "Randevu Al" butonu
- Responsive grid

### 4. Randevu Oluşturma
- Takvim bileşeni
- Müsait saat listesi
- Not ekleme
- Onay butonu

### 5. Randevularım
- Tablo formatında liste
- Status badge (Pending/Approved/Rejected)
- İptal butonu
- Tarih formatlaması

### 6. Admin Dashboard
- İstatistik kartları
- Pending randevular listesi
- Onayla/Reddet butonları
- Toplam sayılar

---

## 🎯 PROJE HEDEFLERİ (HOCA KRİTERLERİ)

| Kriter | Durum | Açıklama |
|--------|-------|----------|
| Tasarım Tamamlanması | ✅ %100 | Next.js ile 8 sayfa tamamlandı |
| Veritabanı Hazırlanması | ✅ %100 | PostgreSQL, 4 tablo, ilişkiler |
| Veritabanı Bağlantısı | ✅ %100 | EF Core ile bağlantı çalışıyor |
| API Hazırlanması | ✅ %100 | 20 endpoint tamamlandı |
| API Kullanımı | ✅ %100 | Frontend-Backend tam entegre |
| Git Hesabı | ✅ %100 | Tüm kod push'landı |
| Dokümantasyon | ✅ %100 | README + KOD_ACIKLAMASI hazır |

**SONUÇ: TÜM KRİTERLER TAMAMLANDI** ✅

---




### Proje Geliştirme Süreci

**Aşamalar:**
1. Requirements analizi
2. Database tasarımı (ERD)
3. Backend API development
4. Frontend UI development
5. Integration
6. Testing
7. Documentation


---

## 📅 GÖSTERIM HAZIRLIĞI

### Derse Getirilecekler

✅ Laptop (Proje çalışır durumda)  
✅ GitHub hesabı açık  
✅ README.md gösterimi  
✅ KOD_ACIKLAMASI.md gösterimi  
✅ Swagger documentation  
✅ Live demo (Backend + Frontend çalışıyor)





**İlk gösterim için tamamen hazır! 🚀**

---

**Öğrenci:** Furkan YILMAZ  
**Tarih:** 16 Kasım 2025  

