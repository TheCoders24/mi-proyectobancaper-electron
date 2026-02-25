//import type { LoginInput, AuthSession, Empresa, Perfil, Sucursal } from "../Entidades/login.entity";
import  type { LoginInput, AuthSession } from "../../../../shared/entidades/Login"
import { loginApi } from "../accesodatos/loginDAL";


/**
 * UseCase: Login
 * =========================
 * Recibe input de UI y devuelve AuthSession
 */
export async function loginUseCase(input: LoginInput): Promise<AuthSession> {
  const result = await loginApi(input);
  return {
    accessToken: result.accessToken,
    user: {
      username: result.user.username,
      role: result.user.role,
      empresaId: result.user.empresaId,
      perfilId: result.user.perfilId,
      sucursalId: result.user.sucursalId,
    },
  };
}



