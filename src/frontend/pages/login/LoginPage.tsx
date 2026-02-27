import React, { useState, useEffect } from "react";
import { AuthService } from "../../services/fachadaservicios";
import { useCredentials } from "./useCredentials";
import { Empresa } from "../../../shared/entidades/Empresas";
import { Sucursal } from "../../../shared/entidades/Sucursales";
import { LoginIdentity } from "../../../shared/entidades/Login";
import { FachadaServicios } from "../../services/fachadaservicios";
import { 
  Building2, 
  MapPin, 
  Keyboard, 
  LogIn, 
  LogOut,
  Monitor,
  CheckCircle,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

const authService = new AuthService();

interface LoginPageProps {
  onLoginSuccess: (result: LoginIdentity) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [empresaId, setEmpresaId] = useState<string>("");
  const [sucursalId, setSucursalId] = useState<string>("");
  const [nombreEquipo, setNombreEquipo] = useState<string>(""); 
  const [loading, setLoading] = useState<boolean>(false);
  const [equipoVerificado, setEquipoVerificado] = useState<boolean>(false);
  const [errorEquipo, setErrorEquipo] = useState<string>("");

  const { usuario, password, inputDisplay, handleKeyDown } = useCredentials();

  /* =====================================================
     🚀 PASO 1: obtener nombre del equipo y cargar empresas
  ===================================================== */
  useEffect(() => {
    const cargarEmpresas = async () => {
      try {
        setLoading(true);
        const equipo = await FachadaServicios.obtenerNombreDeEquipo(); 
        console.log("🖥️ Nombre de equipo:", equipo);

        setNombreEquipo(equipo);
        setEquipoVerificado(true);

        const data = await authService.iniciarLogin(equipo);

        const empre: Empresa[] = data.map((e: any) => ({
          id_: e.Id_Empresa,
          nombre: e.Nombre_Comercial,
        }));

        console.log("✅ Empresas mapeadas:", empre);
        setEmpresas(empre);
        setErrorEquipo("");
      } catch (err: any) {
        console.error("❌ Error al validar equipo:", err.message);
        setErrorEquipo(err.message);
        setEquipoVerificado(false);
      } finally {
        setLoading(false);
      }
    };

    cargarEmpresas();
  }, []);

  /* =====================================================
     🚀 PASO 2: cargar sucursales al seleccionar empresa
  ===================================================== */
  useEffect(() => {
    if (!empresaId) return;

    const cargarSucursales = async () => {
      try {
        setLoading(true);
        console.log("📡 Empresa seleccionada:", empresaId);

        const data = await authService.seleccionarEmpresa(empresaId);

        const mappedSucursales: Sucursal[] = data.map((s: any) => ({
          id: s.id_sucursal || s.Id_sucursal || s.ID,
          nombre: s.nombre || s.Nombre,
        }));

        console.log("✅ Sucursales mapeadas:", mappedSucursales);
        setSucursales(mappedSucursales);
      } catch (err: any) {
        console.error("❌ Error al cargar sucursales:", err.message);
        alert("Error al cargar sucursales: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarSucursales();
  }, [empresaId]);

  /* =====================================================
     🚀 PASO 3: login final
  ===================================================== */
  const handleLogin = async () => {
    try {
      if (!empresaId || !sucursalId) {
        throw new Error("Debe seleccionar empresa y sucursal");
      }

      setLoading(true);

      const result = await authService.autenticarUsuario({
        nombreEquipo,
        idEmpresa: empresaId,
        idSucursal: sucursalId,
        usuario,
        password,
      });

      console.log("✅ Login exitoso:", result);

      // 🔥 GUARDAR DATOS EN SESSIONSTORAGE
      const userData = {
        nombreEquipo,
        empresa: empresas.find(e => e.id_ === empresaId)?.nombre || '',
        idEmpresa: empresaId,
        sucursal: sucursales.find(s => s.id === parseInt(sucursalId))?.nombre || '',
        idSucursal: sucursalId,
        usuario: result.usuario || usuario,
        perfil: result.nombre_perfil || 'Usuario',
        fechaAcceso: new Date().toISOString()
      };

      // Guardar en sessionStorage
      sessionStorage.setItem('userData', JSON.stringify(userData));
      
      // Verificar que se guardó correctamente
      console.log("💾 Datos guardados en sessionStorage:", sessionStorage.getItem('userData'));

      window.location.href = '#/dashboard';
      
      // También puedes llamar a onLoginSuccess si lo necesitas
      onLoginSuccess(result);
      
    } catch (err: any) {
      console.error("❌ Error login:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSalir = () => window.close();

  // Mostrar loading inicial
  if (loading && !equipoVerificado && !errorEquipo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
            <p className="text-white text-lg font-medium">Verificando equipo...</p>
            <p className="text-white/60 text-sm">Por favor espere</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si el equipo no está autorizado
  if (errorEquipo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-700 to-pink-800">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-red-500/20 p-4 rounded-full">
              <AlertCircle className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Acceso Denegado</h2>
            <p className="text-white/80">{errorEquipo}</p>
            <div className="bg-white/10 p-4 rounded-lg w-full">
              <p className="text-white/60 text-sm flex items-center justify-center gap-2">
                <Monitor className="w-4 h-4" />
                {nombreEquipo || "Equipo no identificado"}
              </p>
            </div>
            <button
              onClick={handleSalir}
              className="mt-4 px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-white/90 transition-all duration-200 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Salir
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 transform transition-all duration-300 hover:shadow-3xl">
        {/* Header con logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Bancaper
          </h2>
          <p className="text-gray-500 text-sm uppercase tracking-wider mt-2 flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-gray-300"></span>
            Mi Banca Personal
            <span className="w-8 h-px bg-gray-300"></span>
          </p>
        </div>

        {/* Info del equipo (solo visible cuando está verificado) */}
        {equipoVerificado && (
          <div className="mb-6 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Equipo:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium text-gray-800">{nombreEquipo}</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        )}

        {/* Selector de Empresa */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-gray-700 items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Empresa
          </label>
          <div className="relative">
            <select
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white pr-10"
              value={empresaId}
              onChange={(e) => setEmpresaId(e.target.value)}
              disabled={loading}
            >
              <option value="">Selecciona una empresa</option>
              {empresas.map((emp) => (
                <option key={emp.id_} value={emp.id_}>
                  {emp.nombre}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Selector de Sucursal */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-gray-700 items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Sucursal
          </label>
          <div className="relative">
            <select
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white pr-10 disabled:bg-gray-50 disabled:text-gray-500"
              value={sucursalId}
              onChange={(e) => setSucursalId(e.target.value)}
              disabled={!sucursales.length || loading}
            >
              <option value="">Selecciona una sucursal</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Campo de credenciales (teclado virtual) */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-gray-700 items-center gap-2">
            <Keyboard className="w-4 h-4 text-blue-600" />
            Credenciales
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 font-mono text-lg tracking-wider focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={inputDisplay}
              onKeyDown={handleKeyDown}
              placeholder="Ej Administrador.*****"
              readOnly
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-right">
            Escriba o toque el sensor de huella digital
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            onClick={handleLogin}
            disabled={loading || !empresaId || !sucursalId}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Ingresar</span>
              </>
            )}
          </button>

          <button
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            onClick={handleSalir}
          >
            <LogOut className="w-5 h-5" />
            <span>Salir</span>
          </button>
        </div>

        {/* Footer con versión */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            © 2026 BanCaper - v 0.0.1
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;