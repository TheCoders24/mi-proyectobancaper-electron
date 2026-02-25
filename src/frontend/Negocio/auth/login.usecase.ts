import { loginApi } from "../../Accesodatos/auth/api/auth.api";
import type { AuthSession, LoginInput } from "../../../../src/shared/entidades/Login";

export async function LoginUseCase(
  input: LoginInput
): Promise<AuthSession> {
  const response = await loginApi(input);

  return {
    accessToken: response.access_token,
    user: {
      username: response.user.username,
      role: response.user.role,
      empresaId: response.user.empresa_id,
    },
  };
}