import type {Perfil} from "../../../../shared/entidades/Perfiles"
import { pool, poolConnect } from "../../../config/conexiondb";

/**
 * ==================================
 * PERFILES
 * ==================================
 */
export async function getPerfiles(): Promise<Perfil[]> {
  await poolConnect;
  const result = await pool.request().execute("sp_GetPerfiles");
  return result.recordset as Perfil[];
}