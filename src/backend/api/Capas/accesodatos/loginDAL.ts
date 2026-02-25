import { pool, poolConnect } from "../../../config/conexiondb";
import type { LoginInput, AuthSession} from "../../../../shared/entidades/Login";

export async function loginApi(input: LoginInput): Promise<AuthSession> {
  await poolConnect; // asegura que la conexión esté lista
  const result = await pool
    .request()
    .input("EmpresaId", input.empresaId)
    .input("Usuario", input.usuario)
    .input("Password", input.password)
    .execute("sp_LoginUsuario");

  if (!result.recordset || result.recordset.length === 0) {
    throw new Error("Credenciales incorrectas");
  }

  const user = result.recordset[0];
  return {
    accessToken: "jwt-real-aqui",
    user: {
      username: user.username,
      role: user.role,
      empresaId: user.empresaId,
      perfilId: user.perfilId,
      sucursalId: user.sucursalId,
    },
  };
}


