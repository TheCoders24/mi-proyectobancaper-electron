import { Router } from "express";
import { AuthController} from "./Login.controller"
import { AuthService } from "../../Negocio/LoginBL"
import { AuthRepository } from "../../accesodatos/loginDAL"
import { SqlServerConnection } from "../../accesodatos/SqlServerConnection"

/*
cambiar el nombre a fachada la carpeta routes
*/


const router = Router();

// Inyección manual (simple y clara)
const db = new SqlServerConnection();
const repository = new AuthRepository(db);
const service = new AuthService(repository);
const controller = new AuthController(service);

/**
 * Paso 1: validar equipo → cargar empresas
 */
router.post("/validar-equipo", (req, res) =>
  controller.validarEquipo(req, res)
);

/**
 * Paso 2: cargar sucursales por empresa
 */
router.post("/sucursales", (req, res) =>
  controller.obtenerSucursales(req, res)
);

/**
 * Paso 3: login final
 */
router.post("/login", (req, res) => controller.login(req, res));

export default router;