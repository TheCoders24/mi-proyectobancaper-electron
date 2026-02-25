export interface Empresa {
  id: number;
  nombre: string;
}

export const empresas: Empresa[] = [
  { id: 1, nombre: "🏦 BanCaper Culiacan" },
  { id: 2, nombre: "🏦 BanCper Mazatlán" },
  { id: 3, nombre: "🏦 BanCper Los Mochis" },
];
/*
generar un sps en sqlserver el cual me genere de manera automatica la entidad correspondiente de cada tabla
es decir ejecutar algo asi 
SP_GenerarEntidades Empresas
SP_GenerarAccesoDatos Empresas
SP_GenerarNegocio Empresas
SP_GenerarFachada Empresas
SP_GenerarSPS Empresas ObtenerEmpresaPoId,ObtenerEmpresas,GuardadEmpresas,EliminarEmpresa


// src/shared/entidades/Empresas.ts
export class Empresa {
  empresaId: number
  razonSocial: string
  rfc: string
  representanteLegal?: string
  estado?: string
  municipio?: string
  localidad?: string
  codigoPostal?: string
  colonia?: string
  calle?: string
  numeroExterior?: number
  numeroInterior?: number
  telefono1?: string
  telefono2?: string
  correoElectronico?: string
  paginaWeb?: string
  estatus: boolean

  constructor(
    empresaId: number = 0,
    razonSocial: string = '',
    rfc: string = '',
    representanteLegal?: string,
    estado?: string,
    municipio?: string,
    localidad?: string,
    codigoPostal?: string,
    colonia?: string,
    calle?: string,
    numeroExterior?: number,
    numeroInterior?: number,
    telefono1?: string,
    telefono2?: string,
    correoElectronico?: string,
    paginaWeb?: string,
    estatus: boolean = false
  ) {
    this.empresaId = empresaId
    this.razonSocial = razonSocial
    this.rfc = rfc
    this.representanteLegal = representanteLegal
    this.estado = estado
    this.municipio = municipio
    this.localidad = localidad
    this.codigoPostal = codigoPostal
    this.colonia = colonia
    this.calle = calle
    this.numeroExterior = numeroExterior
    this.numeroInterior = numeroInterior
    this.telefono1 = telefono1
    this.telefono2 = telefono2
    this.correoElectronico = correoElectronico
    this.paginaWeb = paginaWeb
    this.estatus = estatus
  }
}

export class ListaEmpresas extends Array<Empresa> {
  constructor(...items: Empresa[]) {
    super(...items)
    Object.setPrototypeOf(this, ListaEmpresas.prototype)
  }
}


*/

