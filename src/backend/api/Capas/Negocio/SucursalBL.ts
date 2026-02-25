import {getSucursales} from "../accesodatos/SucursalesDAL"
import type {Sucursal} from "../../../../shared/entidades/Sucursales"

/**
 * UseCase: Obtener sucursales
 * @param empresaId opcional para filtrar por empresa
 */
export async function sucursalesUseCase(empresaId?: number): Promise<Sucursal[]> {
  return getSucursales(empresaId);
}