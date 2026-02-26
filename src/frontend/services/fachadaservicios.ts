import { Empresa } from "../../shared/entidades/Empresas";
import { Sucursal } from "../../shared/entidades/Sucursales";
import { LoginIdentity } from "../../shared/entidades/Login";

/* ======================================================
   DATA ACCESS LAYER (FRONTEND → HTTP AL BACKEND)
====================================================== */
class AuthDAL {
  private baseUrl = "http://localhost:3005/api/auth";

  async validarEquipo(nombreEquipo: string): Promise<Empresa[]> {
    const res = await fetch(`${this.baseUrl}/validar-equipo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreEquipo }),
    });

    if (!res.ok) {
      throw new Error(await res.text() || "Error al validar equipo");
    }

    return res.json();
  }

  async obtenerSucursales(idEmpresa: string): Promise<Sucursal[]> {
    const res = await fetch(`${this.baseUrl}/sucursales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idEmpresa }),
    });

    if (!res.ok) {
      throw new Error(await res.text() || "Error al obtener sucursales");
    }

    return res.json();
  }

  async login(data: {
    nombreEquipo: string;
    idEmpresa: string;
    idSucursal: string;
    usuario: string;
    passwordHash: string;
  }): Promise<LoginIdentity> {
    const res = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(await res.text() || "Login fallido");
    }

    return res.json();
  }
}

/* ======================================================
   SERVICE / APPLICATION LOGIC (FRONTEND)
====================================================== */
export class AuthService {
  private authDAL = new AuthDAL();

  /* PASO 1 → validar equipo */
  async iniciarLogin(nombreEquipo: string): Promise<Empresa[]> {
    if (!nombreEquipo) {
      throw new Error("Nombre del equipo requerido");
    }
    return this.authDAL.validarEquipo(nombreEquipo);
  }

  /* PASO 2 → seleccionar empresa */
  async seleccionarEmpresa(idEmpresa: string): Promise<Sucursal[]> {
    if (!idEmpresa) {
      throw new Error("Debe seleccionar una empresa");
    }
    return this.authDAL.obtenerSucursales(idEmpresa);
  }

  /* PASO 3 → autenticar usuario */
  async autenticarUsuario(params: {
    nombreEquipo: string;
    idEmpresa: string;
    idSucursal: string;
    usuario: string;
    password: string;
  }): Promise<LoginIdentity> {
    if (!params.usuario || !params.password) {
      throw new Error("Credenciales incompletas");
    }

    // ⚠️ En el futuro: hash en backend
    const passwordHash = params.password;

    return this.authDAL.login({
      nombreEquipo: params.nombreEquipo,
      idEmpresa: params.idEmpresa,
      idSucursal: params.idSucursal,
      usuario: params.usuario,
      passwordHash,
    });
  }
}

/* ======================================================
   USE CASE SIMPLE (PARA UI / REACT / VUE)
====================================================== */
export const LoginUseCase = async (data: {
  nombreEquipo: string;
  idEmpresa: string;
  idSucursal: string;
  usuario: string;
  password: string;
}): Promise<LoginIdentity> => {
  const service = new AuthService();

  return service.autenticarUsuario({
    nombreEquipo: data.nombreEquipo,
    idEmpresa: data.idEmpresa,
    idSucursal: data.idSucursal,
    usuario: data.usuario,
    password: data.password,
  });
};

/* ======================================================
   FACHADA ELECTRON (IPC)
====================================================== */
export const FachadaServicios = {
  obtenerNombreDeEquipo: () =>
    window.Electron.ipcRenderer.invoke("obtenerNombreDeEquipo"),

  iniciarLogin: (nombreEquipo: string) =>
    window.Electron.ipcRenderer.invoke("validar-equipo", nombreEquipo),
};