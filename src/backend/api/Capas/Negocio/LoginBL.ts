import { AuthRepository } from "../accesodatos/loginDAL";
import { Empresa } from "../../../../shared/entidades/Empresas";
import { Sucursal } from "../../../../shared/entidades/Sucursales";
import { LoginIdentity } from "../../../../shared/entidades/Login";

export class AuthService {
  constructor(private readonly authRepo: AuthRepository) {}

  async iniciarLogin(nombreEquipo: string): Promise<Empresa[]> {
    if (!nombreEquipo) {
      throw new Error("Nombre de equipo requerido");
    }

    return this.authRepo.validarEquipoYEmpresas(nombreEquipo);
  }

  async seleccionarEmpresa(idEmpresa: string): Promise<Sucursal[]> {
    if (!idEmpresa) {
      throw new Error("Empresa requerida");
    }

    return this.authRepo.obtenerSucursalesPorEmpresa(idEmpresa);
  }

  async autenticarUsuario(data: {
    nombreEquipo: string;
    idEmpresa: string;
    idSucursal: string;
    usuario: string;
    passwordHash: string;
  }): Promise<LoginIdentity> {
    return this.authRepo.login(data);
  }
}


