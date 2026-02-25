import { contextBridge, ipcRenderer } from 'electron';

console.log('🔄 Preload script cargado');

// Variable para almacenar la URL
let apiUrlCache: string | null = null;

// Exponer APIs seguras al frontend
contextBridge.exposeInMainWorld('electronAPI', {
  // Obtener URL de la API
  getApiUrl: () => {
    console.log('📤 Solicitando API URL...');
    // Si ya tenemos la URL en caché, la devolvemos
    if (apiUrlCache) {
      console.log('📤 Devolviendo URL desde caché:', apiUrlCache);
      return Promise.resolve(apiUrlCache);
    }
    
    // Si no, solicitamos la URL y esperamos
    return new Promise((resolve) => {
      console.log('⏳ Esperando API URL...');
      
      // Escuchar una sola vez el evento 'api-url'
      ipcRenderer.once('api-url', (event, url) => {
        console.log('📥 API URL recibida:', url);
        apiUrlCache = url;
        resolve(url);
      });
      
      // Timeout por si no llega la URL
      setTimeout(() => {
        if (!apiUrlCache) {
          console.warn('⚠️ Timeout esperando API URL, usando localhost:3000');
          const defaultUrl = 'http://localhost:3000';
          apiUrlCache = defaultUrl;
          resolve(defaultUrl);
        }
      }, 3000);
    });
  },
  
  // Escuchar eventos
  onApiUrl: (callback: (url: string) => void) => {
    ipcRenderer.on('api-url', (event, url) => {
      console.log('📥 Evento API URL recibido:', url);
      apiUrlCache = url;
      callback(url);
    });
  },
  
  // Helper para hacer peticiones a tu API
  api: {
    // GET request
    get: async (endpoint: string) => {
      try {
        // Obtener la URL base
        const baseUrl = await (window as any).electronAPI.getApiUrl();
        const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
        
        console.log('📤 GET Request:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📥 GET Response:', data);
        return data;
      } catch (error) {
        console.error('❌ Error en GET:', error);
        throw error;
      }
    },
    
    // POST request
    post: async (endpoint: string, data: any) => {
      try {
        const baseUrl = await (window as any).electronAPI.getApiUrl();
        const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
        
        console.log('📤 POST Request:', url, data);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log('📥 POST Response:', responseData);
        return responseData;
      } catch (error) {
        console.error('❌ Error en POST:', error);
        throw error;
      }
    },
    
    // PUT request
    put: async (endpoint: string, data: any) => {
      try {
        const baseUrl = await (window as any).electronAPI.getApiUrl();
        const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
        
        console.log('📤 PUT Request:', url, data);
        
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log('📥 PUT Response:', responseData);
        return responseData;
      } catch (error) {
        console.error('❌ Error en PUT:', error);
        throw error;
      }
    },
    
    // DELETE request
    delete: async (endpoint: string) => {
      try {
        const baseUrl = await (window as any).electronAPI.getApiUrl();
        const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
        
        console.log('📤 DELETE Request:', url);
        
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log('📥 DELETE Response:', responseData);
        return responseData;
      } catch (error) {
        console.error('❌ Error en DELETE:', error);
        throw error;
      }
    }
  }
});

console.log('✅ API expuesta al frontend');