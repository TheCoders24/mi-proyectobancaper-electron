// src\frontend\pages\Dashboard\DashboardPages.tsx
import React, { useState, useEffect } from "react";

import { 
  Building2, 
  User, 
  Shield, 
  LogOut, 
  Monitor,
  CheckCircle,
  MapPin,
  Clock
} from 'lucide-react';

interface UserData {
  nombreEquipo: string;
  empresa: string;
  idEmpresa: string;
  sucursal: string;
  idSucursal: string;
  usuario: string;
  perfil: string;
  fechaAcceso: string;
}

const DashboardPages: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener datos del sessionStorage
    const storedData = sessionStorage.getItem('userData');
    console.log("📦 Datos recuperados en Dashboard:", storedData);
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("✅ Datos parseados:", parsedData);
        setUserData(parsedData);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error parsing data:", error);
        // Si hay error, redirigir al login
        window.location.href = '#/login';
      }
    } else {
      // Si no hay datos, redirigir al login
      console.log("⚠️ No hay datos de sesión, redirigiendo a login");
      window.location.href = '#/login';
    }
  }, []);

  const handleLogout = () => {
    console.log("🚪 Cerrando sesión");
    sessionStorage.removeItem('userData');
    window.location.href = '#/login';
    
  };

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando dashboard...</p>
          <p className="text-blue-200 text-sm mt-2">Recuperando información de sesión</p>
        </div>
      </div>
    );
  }

  // Si no hay datos, no mostrar nada (la redirección ocurrirá)
  if (!userData) {
    return null;
  }

  // Determinar color de perfil
  const getPerfilColor = (perfil: string) => {
    switch(perfil.toLowerCase()) {
      case 'administrador':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gerente':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cajero':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'auditor':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800">
      {/* Barra superior con FONDO VERDE */}
      <div className="bg-green-600/95 backdrop-blur-md shadow-lg border-b border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Lado izquierdo - Información del usuario */}
            <div className="flex items-center space-x-6">
              {/* Avatar con inicial - AZUL para contraste */}
              <div className="flex-shrink-0">
                <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white">
                  {userData.usuario.charAt(0).toUpperCase()}
                </div>
              </div>
              
              {/* Detalles del usuario - TEXTO BLANCO */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">
                    {userData.usuario}
                  </h1>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium bg-white ${getPerfilColor(userData.perfil).split(' ')[1]}`}>
                    {userData.perfil}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mt-1">
                  {/* Empresa */}
                  <div className="flex items-center gap-1 text-sm text-white">
                    <Building2 className="w-4 h-4 text-white" />
                    <span className="font-medium">{userData.empresa}</span>
                  </div>
                  
                  {/* Sucursal */}
                  <div className="flex items-center gap-1 text-sm text-white">
                    <MapPin className="w-4 h-4 text-white" />
                    <span className="font-medium">{userData.sucursal}</span>
                  </div>
                  
                  {/* Equipo */}
                  <div className="flex items-center gap-1 text-sm text-white">
                    <Monitor className="w-4 h-4 text-white" />
                    <span className="font-mono font-medium">{userData.nombreEquipo}</span>
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  
                  {/* Fecha */}
                  <div className="flex items-center gap-1 text-sm text-white/80">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(userData.fechaAcceso).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado derecho - Botón de cerrar sesión ROJO */}
            <div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-red-600/30 transform hover:scale-105 active:scale-95"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal del dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensaje de bienvenida */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl mb-8 overflow-hidden border border-white/20">
          <div className="relative p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                ¡Bienvenido al sistema bancario!
              </h2>
              <p className="text-green-600">
                Has iniciado sesión correctamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPages;