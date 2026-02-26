import { Empresa } from "../../../../shared/entidades/Empresas";
import { Sucursal } from "../../../../shared/entidades/Sucursales";
import { LoginIdentity } from "../../../../shared/entidades/Login";
import { SqlServerConnection } from "./SqlServerConnection";

export class AuthRepository {
  constructor(private readonly db: SqlServerConnection) {}

  async validarEquipoYEmpresas(nombreEquipo: string): Promise<Empresa[]> {
    const result = await this.db.executeStoredProcedure(
      "Auth_Login_Completo",
      {
        Paso: 1,
        NombreEquipo: nombreEquipo,
      }
    );

    return result.recordset as Empresa[];
  }

  async obtenerSucursalesPorEmpresa(idEmpresa: string): Promise<Sucursal[]> {
    const result = await this.db.executeStoredProcedure(
      "Auth_Login_Completo",
      {
        Paso: 2,
        IdEmpresa: idEmpresa,
      }
    );

    return result.recordset as Sucursal[];
  }

  async login(params: {
    nombreEquipo: string;
    idEmpresa: string;
    idSucursal: string;
    usuario: string;
    passwordHash: string;
  }): Promise<LoginIdentity> {
    const result = await this.db.executeStoredProcedure(
      "Auth_Login_Completo",
      {
        Paso: 3,
        NombreEquipo: params.nombreEquipo,
        IdEmpresa: params.idEmpresa,
        IdSucursal: params.idSucursal,
        Usuario: params.usuario,
        PasswordHash: params.passwordHash,
      }
    );

    return result.recordset[0] as LoginIdentity;
  }
}