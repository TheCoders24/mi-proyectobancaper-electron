// src/frontend/AccesoDatos/loginDAL.ts
import { Empresa } from "../../../shared/entidades/Empresas";
import { Sucursal } from "../../../shared/entidades/Sucursales";
import { LoginIdentity } from "../../../shared/entidades/Login";

export class AuthDAL {
  private baseUrl = "http://localhost:3005/api/auth"; // URL de tu backend

  async validarEquipo(nombreEquipo: string): Promise<Empresa[]> {
    const res = await fetch(`${this.baseUrl}/validar-equipo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreEquipo }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Error al validar equipo");
    }

    return res.json() as Promise<Empresa[]>;
  }

  async obtenerSucursales(idEmpresa: string): Promise<Sucursal[]> {
    const res = await fetch(`${this.baseUrl}/sucursales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idEmpresa }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Error al obtener sucursales");
    }

    return res.json() as Promise<Sucursal[]>;
  }

  async login(data: {
    nombreEquipo: string;
    idEmpresa: string;
    idSucursal: string;
    usuario: string;
    passwordHash: string;
  }): Promise<LoginIdentity> {
    const res = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Login fallido");
    }

    return res.json() as Promise<LoginIdentity>;
  }
}