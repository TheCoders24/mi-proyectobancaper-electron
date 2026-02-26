// src/frontend/Negocio/auth/login.usecase.ts
import { AuthDAL} from "../../Accesodatos/login/loginDAL"
import { Empresa } from "../../../shared/entidades/Empresas";
import { Sucursal } from "../../../shared/entidades/Sucursales";
import { LoginIdentity } from "../../../shared/entidades/Login";

const authDAL = new AuthDAL();

export class AuthService {
  /* PASO 1 → validar equipo y cargar empresas */
  async iniciarLogin(nombreEquipo: string): Promise<Empresa[]> {
    if (!nombreEquipo) throw new Error("Nombre del equipo requerido");
    return authDAL.validarEquipo(nombreEquipo);
  }

  /* PASO 2 → seleccionar empresa y cargar sucursales */
  async seleccionarEmpresa(idEmpresa: string): Promise<Sucursal[]> {
    if (!idEmpresa) throw new Error("Debe seleccionar una empresa");
    return authDAL.obtenerSucursales(idEmpresa);
  }

  /* PASO 3 → autenticar usuario */
  async autenticarUsuario(params: {
    nombreEquipo: string;
    idEmpresa: string;
    idSucursal: string;
    usuario: string;
    password: string;
  }): Promise<LoginIdentity> {
    if (!params.usuario || !params.password) throw new Error("Credenciales incompletas");

    // ⚠️ Aquí puedes hashear la contraseña si lo deseas
    const passwordHash = params.password;

    return authDAL.login({
      nombreEquipo: params.nombreEquipo,
      idEmpresa: params.idEmpresa,
      idSucursal: params.idSucursal,
      usuario: params.usuario,
      passwordHash,
    });
  }
}

/* Caso de uso simple que puedes importar en tus componentes */
export const LoginUseCase = async (data: {
  empresaId: string;
  usuario: string;
  password: string;
}): Promise<LoginIdentity> => {
  const service = new AuthService();
  return service.autenticarUsuario({
    nombreEquipo: "" ,
    idEmpresa: data.empresaId,
    idSucursal: "DEFAULT", // Esto luego puedes hacerlo dinámico según el select
    usuario: data.usuario,
    password: data.password,
  });
};