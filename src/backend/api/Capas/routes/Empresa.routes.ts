import { Router } from 'express';
import { empresasUseCase }  from '../../Capas/Negocio/EmpresaBL';

const router = Router();

// Ruta para obtener todas las empresas
router.get('/empresas', async (req, res) => {
  try {
    const empresas = await empresasUseCase();
    res.json({
      success: true,
      data: empresas
    });
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las empresas',
      error: "Sucedio un Error en empresas"
    });
  }
});

/*

// Si quieres agregar filtros desde query params
router.get('/empresas/filtradas', async (req, res) => {
  try {
    const { activa, ordenarPor } = req.query;
    
    // Aquí puedes pasar los filtros si tu caso de uso los soporta
    const filtros = {};
    if (activa !== undefined) filtros.activa = activa === 'true';
    if (ordenarPor) filtros.ordenarPor = ordenarPor;
    
    const empresas = await empresasUseCase(filtros);
    res.json({
      success: true,
      data: empresas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las empresas',
      error: error.message
    });
  }
});

// Ruta para obtener una empresa específica
router.get('/empresas/:id', async (req, res) => {
  try {
    const empresas = await empresasUseCase();
    const empresa = empresas.find(e => e.id === parseInt(req.params.id));
    
    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: empresa
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la empresa',
      error: error.message
    });
  }
});
*/

export default router;