import type { LoginInput } from "../../../../shared/entidades/Login";
import { httpPost } from "../httpClient";

/**
 * ============================
 * API LOGIN
 * ============================
 */
export async function loginApi({
  empresaId,
  usuario,
  password,
}: LoginInput): Promise<{
  access_token: string;
  user: {
    username: string;
    role: string;
    empresa_id: string;
  };
}> {
  // Llamada a la API real que se conecta a la base de datos
  return httpPost("http://localhost:3005/api/login", {
    empresa_id: empresaId,
    username: usuario,
    password: password,
  });
}