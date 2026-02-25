import React, { useState } from "react";
import { LoginUseCase } from "../../Negocio/auth/login.usecase";
import { useCredentials } from "./useCredentials";
import { empresas } from "../../../shared/entidades/Empresas";


// 1️⃣ Props tipadas
interface LoginPageProps {
  onLoginSuccess: (result: any) => void; // puedes reemplazar 'any' por el tipo real de tu login
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  // 2️⃣ Estados
  const [empresaId, setEmpresaId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 3️⃣ Hook personalizado para credenciales
  const { usuario, password, inputDisplay, handleKeyDown } = useCredentials();

  // 4️⃣ Función de login
  const handleLogin = async () => {
    try {
      setLoading(true);

      const result = await LoginUseCase({
        empresaId,
        usuario,
        password
      });

      onLoginSuccess(result);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5️⃣ Función para cerrar la app
  const handleSalir = () => {
    window.close();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 relative overflow-hidden">
      {/* Estrellas animadas */}
      <div className="absolute inset-0">
        <div className="stars"></div>
      </div>

      {/* Card de login */}
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

        {/* Selector de sucursal */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="mr-2">🏢</span> Selecciona la Sucursal
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={empresaId}
            onChange={(e) => setEmpresaId(e.target.value)}
          >
            <option value="">Elige una opción</option>
            {empresas.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nombre}
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
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Procesando...
              </span>
            ) : "Ingresar"}
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