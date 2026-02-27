import { app, BrowserWindow } from 'electron';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { networkInterfaces } from 'os';
import loginRoutes from '../api/Capas/Fachadaselectron/Login/login.routes';
import { ipcMain } from "electron";
import os from "os";

let mainWindow: BrowserWindow | null = null;
let apiServer: any = null;

// Función para obtener la IP local
function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}



async function startApiServer() {
  const api = express();
  const port = 3005;
  const localIP = getLocalIP();

  // Middlewares
  api.use(cors({
    origin: '*', // En producción, especifica orígenes permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  api.use(express.json());
  api.use(express.urlencoded({ extended: true }));

  // Middleware de logging detallado
  api.use((req, res, next) => {
    console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('   Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('   Body:', req.body);
    }
    next();
  });

  // Ruta de salud mejorada
  api.get('/api/health', (req, res) => {
    res.json({
      success: true,
      status: 'OK',
      timestamp: new Date().toISOString(),
      electron: true,
      version: app.getVersion(),
      endpoints: {
        health: '/api/health',
        test: '/api/test',
        empresas: '/api/empresas',
        login: '/api/login',
        perfiles: '/api/perfiles',
        sucursales: '/api/sucursales'
      }
    });
  });

  // Ruta de prueba simple
  api.get('/api/test', (req, res) => {
    res.json({
      success: true,
      message: 'API funcionando correctamente',
      data: {
        sample: 'datos de prueba'
      }
    });
  });

  // Ruta POST de prueba
  api.post('/api/test', (req, res) => {
    res.json({
      success: true,
      message: 'POST recibido',
      data: req.body
    });
  });

  api.use('/api/auth', loginRoutes)


  // Aquí van tus rutas reales
  // api.use('/api/empresas', EmpresasRouter);
  // etc...

  return new Promise((resolve, reject) => {
    try {
      apiServer = api.listen(port, '0.0.0.0', () => {
        const address = apiServer.address();
        console.log('\n✅ ==================================');
        console.log('🚀 SERVIDOR API INICIADO CORRECTAMENTE');
        console.log('=====================================');
        console.log(`📡 Local: http://localhost:${port}`);
        console.log(`📡 Red: http://${localIP}:${port}`);
        console.log(`📡 API Health: http://localhost:${port}/api/health`);
        console.log(`📡 API Test: http://localhost:${port}/api/test`);
        console.log('=====================================\n');
        resolve(apiServer);
      });

      apiServer.on('error', (error: any) => {
        console.error('❌ Error en servidor API:', error);
        reject(error);
      });

    } catch (error) {
      console.error('❌ Error iniciando servidor API:', error);
      reject(error);
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Cargar tu frontend
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  ipcMain.handle("obtenerNombreDeEquipo", ()=>{
    return os.hostname();
  })

  // Abrir DevTools
  mainWindow.webContents.openDevTools();

  // Cuando la ventana esté lista, enviar la URL de la API
  mainWindow.webContents.on('did-finish-load', () => {
    if (apiServer) {
      const port = apiServer.address().port;
      const apiUrl = `http://localhost:${port}`;
      console.log('📤 Enviando API URL al frontend:', apiUrl);
      mainWindow?.webContents.send('api-url', apiUrl);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Iniciar aplicación
app.whenReady().then(async () => {
  try {
    console.log('🔄 Iniciando servidor API...');
    await startApiServer();
    
    console.log('🔄 Creando ventana principal...');
    createWindow();
    
    console.log('✅ Aplicación iniciada correctamente');
  } catch (error) {
    console.error('❌ Error fatal:', error);
  }
});

app.on('window-all-closed', () => {
  if (apiServer) {
    console.log('🛑 Deteniendo servidor API...');
    apiServer.close();
  }
  if (process.platform !== 'darwin') app.quit();
});
