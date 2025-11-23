# Randevu Yönetim Sistemi

**Furkan YILMAZ** - .NET Programlama Dersi  
Enver BAĞCI - 23 Kasım 2025

---

## Proje Hakkında

İşletmelerin müşterilerine randevu hizmeti sunmasını sağlayan web ve mobil uygulama.

**Müşteri:** Kayıt ol, işletmeleri gör, randevu al, randevularımı takip et  
**Admin:** Randevuları görüntüle, onayla/reddet, istatistikleri gör

---

## Teknolojiler

**Backend:** ASP.NET Core 9.0, PostgreSQL, Entity Framework, JWT  
**Frontend:** React (Next.js 15), TypeScript, Tailwind CSS  
**Mobile:** Flutter, Dart  
**Diğer:** Docker, Swagger

---

## Çalıştırma

### Docker ile (Önerilen)

```bash
colima start --cpu 4 --memory 8
docker-compose up -d
```

**Erişim:**
- Frontend: http://localhost:3000
- API: http://localhost:5025
- Swagger: http://localhost:5025/swagger

### Manuel Çalıştırma

```bash
# Backend
cd AppointmentSystem && dotnet run

# Frontend
cd appointme && npm install && npm run dev

# Flutter
cd appointme_flutter && flutter run
```

---

## Test Hesapları

**Müşteri:** customer@test.com / Test123!  
**Admin:** admin@appointment.com / Admin123!

---

## Proje Yapısı

```
appointment/
├── AppointmentSystem/      # Backend (.NET 9.0)
│   ├── Controllers/       # API endpoints
│   ├── Models/            # Database models
│   └── Data/              # DbContext
├── appointme/             # Frontend (React)
│   └── src/
├── appointme_flutter/     # Mobile (Flutter)
│   └── lib/
└── docker-compose.yml     # Docker config
```

---

## Veritabanı

**Bağlantı:** localhost:5432 / appointmentdb / postgres / postgres

**Tablolar:** users, services, appointments, business_settings, working_hours, break_times

```bash
# Bağlan
psql -U postgres -d appointmentdb

# Tabloları gör
\dt
```

---

## API Endpoints

**Base URL:** http://localhost:5025/api

```
POST   /auth/register              - Kayıt ol
POST   /auth/login                 - Giriş yap
GET    /appointments/user/{id}     - Randevularım
POST   /appointments               - Randevu oluştur
PUT    /appointments/{id}/status   - Durum güncelle (Admin)
DELETE /appointments/{id}          - Randevu iptal
GET    /services                   - Hizmetler
GET    /availability/{id}          - Müsait saatler
```

**Swagger:** http://localhost:5025/swagger

---

## Sorun Giderme

```bash
# Port temizle
lsof -ti:3000 | xargs kill
lsof -ti:5025 | xargs kill

# Docker yeniden başlat
docker-compose down -v
docker-compose up --build
```

---

## Proje Durumu

✅ Backend API  
✅ Veritabanı  
✅ Frontend  
✅ Mobile  
✅ Docker

---

## Dokümantasyon

- [Backend Detaylı](AppointmentSystem/README.md)

---

**Furkan YILMAZ** tarafından .NET Programlama dersi için geliştirilmiştir.
