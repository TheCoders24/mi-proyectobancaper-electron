import React, { useState, useEffect } from "react";
import { AuthService } from "../../services/login.usecase";
import { useCredentials } from "./useCredentials";
import { Empresa } from "../../../shared/entidades/Empresas";
import { Sucursal } from "../../../shared/entidades/Sucursales";
import { LoginIdentity } from "../../../shared/entidades/Login";
import { FachadaServicios } from "../../services/fachadaservicios"

import os from 'os' 

const authService = new AuthService();

interface LoginPageProps {
  onLoginSuccess: (result: LoginIdentity) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [empresaId, setEmpresaId] = useState<string>("");
  const [sucursalId, setSucursalId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { usuario, password, inputDisplay, handleKeyDown } = useCredentials();

  // 🚀 Cargar empresas al montar
  useEffect(() => {
  const nombreEquipo = FachadaServicios.obtenerNombreDeEquipo(); 
  //const nombreEquipo = "DESKTOP-7FVF0T5"
  console.log("Nombre de equipo para validar:", nombreEquipo);

  authService
    .iniciarLogin(nombreEquipo)
    .then((data) => {
      console.log("✅ Empresas crudas desde repo:", data);

      const empre: Empresa[] = data.map((e: any) => ({
        id_: e.Id_Empresa,         // mapeo correcto
        nombre: e.Nombre_Comercial, // mapeo correcto
      }));

      console.log("✅ Empresas mapeadas:", empre);
      setEmpresas(empre);
    })
    .catch((err) => alert("Error al validar equipo: " + err.message));
  }, []);

  // 🚀 Cargar sucursales al seleccionar empresa
  useEffect(() => {
    if (!empresaId) return;

    console.log("📡 Empresa seleccionada:", empresaId);

    authService
      .seleccionarEmpresa(empresaId)
      .then((data) => {
        console.log("✅ Sucursales crudas:", data);

        const mappedSucursales = data.map((s: any) => ({
          id: s.id_sucursal || s.Id_sucursal || s.ID,
          nombre: s.nombre || s.Nombre,
        }));
        console.log("✅ Sucursales mapeadas:", mappedSucursales);

        setSucursales(mappedSucursales);
      })
      .catch((err) => {
        console.error("❌ Error al cargar sucursales:", err.message);
        alert("Error al cargar sucursales: " + err.message);
      });
  }, [empresaId]);

  // Login final
  const handleLogin = async () => {
    try {
      if (!empresaId || !sucursalId) throw new Error("Debe seleccionar empresa y sucursal");

      setLoading(true);

      const result = await authService.autenticarUsuario({
        nombreEquipo: "DESKTOP-7FVF0T5",
        idEmpresa: empresaId,
        idSucursal: sucursalId,
        usuario,
        password,
      });

      console.log("✅ Login exitoso:", result);

      onLoginSuccess(result);
    } catch (err: any) {
      console.error("❌ Error login:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSalir = () => window.close();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="stars"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all hover:scale-105">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-4xl mb-4 animate-pulse">
            🏦
          </div>
          <h2 className="text-3xl font-bold text-gray-800">BanCaper</h2>
          <p className="text-blue-600 text-sm uppercase tracking-wider mt-2">
            Tu banco digital de confianza
          </p>
        </div>

        {/* Selector de empresa */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="mr-2">🏢</span> Selecciona la Empresa
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={empresaId}
            onChange={(e) => setEmpresaId(e.target.value)}
          >
            <option value="">Elige una empresa</option>
            {empresas.map((emp) => (
              <option key={emp.id_} value={emp.id_}>
                {emp.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de sucursal */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="mr-2">🏬</span> Selecciona la Sucursal
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={sucursalId}
            onChange={(e) => setSucursalId(e.target.value)}
            disabled={!sucursales.length}
          >
            <option value="">Elige una sucursal</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Credenciales */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="mr-2">👤</span> Credenciales de acceso
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={inputDisplay}
            onKeyDown={handleKeyDown}
            placeholder="Usuario.Contraseña"
            autoComplete="off"
            readOnly
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 Escribe tu usuario, presiona "." y escribe tu contraseña
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            className={`flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Ingresar"}
          </button>

          <button
            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all transform hover:scale-105"
            onClick={handleSalir}
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;