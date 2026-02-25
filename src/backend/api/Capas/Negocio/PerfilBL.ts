import {getPerfiles} from "../accesodatos/PerfilesDAL" 
import type {Perfil} from "../../../../shared/entidades/Perfiles" 
/**
 * UseCase: Obtener todos los perfiles
 */
export async function perfilesUseCase(): Promise<Perfil[]> {
  return getPerfiles();
}