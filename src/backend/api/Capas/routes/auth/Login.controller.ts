import { Request, Response } from "express";
import { AuthService } from "../../Negocio/LoginBL";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 1️⃣ Validar equipo y cargar empresas
  validarEquipo = async (req: Request, res: Response) => {
    try {
      const { nombreEquipo } = req.body;

      const empresas = await this.authService.iniciarLogin(nombreEquipo);

      res.status(200).json(empresas);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // 2️⃣ Obtener sucursales por empresa
  obtenerSucursales = async (req: Request, res: Response) => {
    try {
      const { idEmpresa } = req.body;

      const sucursales = await this.authService.seleccionarEmpresa(idEmpresa);

      res.status(200).json(sucursales);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // 3️⃣ Login final
  login = async (req: Request, res: Response) => {
    try {
      const identity = await this.authService.autenticarUsuario(req.body);

      res.status(200).json(identity);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };
}