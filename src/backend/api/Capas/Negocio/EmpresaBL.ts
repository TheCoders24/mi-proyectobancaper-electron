import {getEmpresas} from"../accesodatos/EmpresasDAL"
import type {Empresa} from "../../../../shared/entidades/Empresas"

/**
 * UseCase: Obtener todas las empresas
 */
export async function empresasUseCase(): Promise<Empresa[]> {
  return getEmpresas();
}
