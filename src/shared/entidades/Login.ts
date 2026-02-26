
export class LoginIdentity {
  id_Usuario: string;
  usuario: string;
  usuarioActivo: boolean;
  id_Perfil: string;
  nombre_perfil: string;
  perfilActivo: boolean;
  id_Empresa: string;
  nombre_Comercial: string;
  empresaActivo: boolean;
  id_sucursal: string;
  nombreSucursal: string;
  codigo_Sucursal: string;
  sucursalActivo: boolean;
  id_equipo: string;
  nombreEquipo: string;
  equipoActivo: boolean;

  constructor(
id_Usuario: string = "",
usuario: string = "",
usuarioActivo: boolean = false,
id_Perfil: string = "",
nombre_perfil: string = "",
perfilActivo: boolean = false,
id_Empresa: string = "",
nombre_Comercial: string = "",
empresaActivo: boolean = false,
id_sucursal: string = "",
nombreSucursal: string = "",
codigo_Sucursal: string = "",
sucursalActivo: boolean = false,
id_equipo: string = "",
nombreEquipo: string = "",
equipoActivo: boolean = false
  ) {
    this.id_Usuario = id_Usuario;
    this.usuario = usuario;
    this.usuarioActivo = usuarioActivo;
    this.id_Perfil = id_Perfil;
    this.nombre_perfil = nombre_perfil;
    this.perfilActivo = perfilActivo;
    this.id_Empresa = id_Empresa;
    this.nombre_Comercial = nombre_Comercial;
    this.empresaActivo = empresaActivo;
    this.id_sucursal = id_sucursal;
    this.nombreSucursal = nombreSucursal;
    this.codigo_Sucursal = codigo_Sucursal;
    this.sucursalActivo = sucursalActivo;
    this.id_equipo = id_equipo;
    this.nombreEquipo = nombreEquipo;
    this.equipoActivo = equipoActivo;
  }
}

export class ListaLoginIdentity extends Array<LoginIdentity> {
  constructor(...items: LoginIdentity[]) {
    super(...items);
    Object.setPrototypeOf(this, ListaLoginIdentity.prototype);
  }
}

