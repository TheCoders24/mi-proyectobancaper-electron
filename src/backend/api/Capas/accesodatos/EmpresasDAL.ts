import type { Empresa } from "../../../../shared/entidades/Empresas";
import { pool, poolConnect } from "../../../config/conexiondb";

/**
 * ==================================
 * EMPRESAS - DATA ACCESS LAYER
 * ==================================
 */

// Obtener todas las empresas
export async function getEmpresas(): Promise<Empresa[]> {
  await poolConnect;
  const result = await pool.request().execute("sp_GetEmpresas");
  return result.recordset as Empresa[];
}


/*

// Obtener una empresa por ID
export async function getEmpresaById(id: number): Promise<Empresa | null> {
  await poolConnect;
  const result = await pool
    .request()
    .input("IdEmpresa", id)
    .execute("sp_GetEmpresaById");
  
  return result.recordset[0] as Empresa || null;
}

// Crear una nueva empresa
export async function createEmpresa(empresa: Omit<Empresa, 'id'>): Promise<Empresa> {
  await poolConnect;
  const result = await pool
    .request()
    .input("Nombre", empresa.nombre)
    .input("Direccion", empresa.direccion)
    .input("Telefono", empresa.telefono)
    .input("Email", empresa.email)
    .input("RUC", empresa.ruc)
    .input("Estado", empresa.estado || 'Activa')
    .input("FechaCreacion", new Date())
    .execute("sp_CreateEmpresa");
  
  return result.recordset[0] as Empresa;
}

// Actualizar una empresa existente
export async function updateEmpresa(id: number, empresa: Partial<Empresa>): Promise<Empresa | null> {
  await poolConnect;
  const result = await pool
    .request()
    .input("IdEmpresa", id)
    .input("Nombre", empresa.nombre)
    .input("Direccion", empresa.direccion)
    .input("Telefono", empresa.telefono)
    .input("Email", empresa.email)
    .input("RUC", empresa.ruc)
    .input("Estado", empresa.estado)
    .input("FechaModificacion", new Date())
    .execute("sp_UpdateEmpresa");
  
  return result.recordset[0] as Empresa || null;
}

// Eliminar una empresa (lógica o física)
export async function deleteEmpresa(id: number, fisica: boolean = false): Promise<boolean> {
  await poolConnect;
  const result = await pool
    .request()
    .input("IdEmpresa", id)
    .input("EliminacionFisica", fisica)
    .execute("sp_DeleteEmpresa");
  
  return result.rowsAffected[0] > 0;
}

// Cambiar estado de una empresa (Activar/Desactivar)
export async function cambiarEstadoEmpresa(id: number, estado: string): Promise<boolean> {
  await poolConnect;
  const result = await pool
    .request()
    .input("IdEmpresa", id)
    .input("Estado", estado)
    .execute("sp_CambiarEstadoEmpresa");
  
  return result.rowsAffected[0] > 0;
}

// Buscar empresas por nombre o RUC
export async function buscarEmpresas(termino: string): Promise<Empresa[]> {
  await poolConnect;
  const result = await pool
    .request()
    .input("TerminoBusqueda", `%${termino}%`)
    .execute("sp_BuscarEmpresas");
  
  return result.recordset as Empresa[];
}

// Obtener empresas por estado
export async function getEmpresasByEstado(estado: string): Promise<Empresa[]> {
  await poolConnect;
  const result = await pool
    .request()
    .input("Estado", estado)
    .execute("sp_GetEmpresasByEstado");
  
  return result.recordset as Empresa[];
}

// Verificar si existe una empresa por RUC
export async function existeEmpresaByRUC(ruc: string, excludeId?: number): Promise<boolean> {
  await poolConnect;
  const result = await pool
    .request()
    .input("RUC", ruc)
    .input("ExcludeId", excludeId || null)
    .execute("sp_ExisteEmpresaByRUC");
  
  return result.recordset[0]?.existe === 1;
}

// Obtener total de empresas
export async function getTotalEmpresas(estado?: string): Promise<number> {
  await poolConnect;
  const result = await pool
    .request()
    .input("Estado", estado || null)
    .execute("sp_GetTotalEmpresas");
  
  return result.recordset[0]?.total || 0;
}

// Obtener empresas paginadas
export async function getEmpresasPaginadas(
  pagina: number = 1, 
  registrosPorPagina: number = 10,
  estado?: string
): Promise<{ empresas: Empresa[]; total: number; paginas: number }> {
  await poolConnect;
  const result = await pool
    .request()
    .input("Pagina", pagina)
    .input("RegistrosPorPagina", registrosPorPagina)
    .input("Estado", estado || null)
    .execute("sp_GetEmpresasPaginadas");
  
  const empresas = result.recordsets[0] as Empresa[];
  const total = result.recordsets[1][0]?.total || 0;
  const paginas = Math.ceil(total / registrosPorPagina);
  
  return {
    empresas,
    total,
    paginas
  };
}
*/