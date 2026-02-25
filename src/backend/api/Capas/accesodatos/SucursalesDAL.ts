import type {Sucursal} from "../../../../shared/entidades/Sucursales"
import { pool, poolConnect } from "../../../config/conexiondb";

/**
 * ==================================
 * SUCURSALES
 * @param empresaId opcional para filtrar
 * ==================================
 */
export async function getSucursales(empresaId?: number): Promise<Sucursal[]> {
  await poolConnect;
  const request = pool.request();
  if (empresaId !== undefined) {
    request.input("EmpresaId", empresaId);
  }
  const result = await request.execute("sp_GetSucursales");
  return result.recordset as Sucursal[];
}