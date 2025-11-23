# Backend Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5025

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["AppointmentSystem.csproj", "."]
RUN dotnet restore "AppointmentSystem.csproj"
COPY . .
RUN dotnet build "AppointmentSystem.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AppointmentSystem.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AppointmentSystem.dll"]
