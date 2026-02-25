import { Router } from 'express';

const router = Router();

// Exportamos un router vacío por ahora
// Más adelante agregaremos las rutas específicas
router.get('/test', (req, res) => {
  res.json({ message: 'API Capas funcionando' });
});

export default router;