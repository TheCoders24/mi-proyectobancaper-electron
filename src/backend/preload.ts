import { contextBridge, ipcRenderer } from "electron";

console.log("🔄 Preload script cargado");

// Cache de la URL de la API
let apiUrlCache: string | null = null;
contextBridge.exposeInMainWorld("electronAPI", {
  /* ===============================
     SISTEMA / ELECTRON
  =============================== */

  obtenerNombreDeEquipo: (): Promise<string> => {
    return ipcRenderer.invoke("obtenerNombreDeEquipo");
  },


  /* ===============================
     API BACKEND (EXPRESS)
  =============================== */

  getApiUrl: (): Promise<string> => {
    // Si ya tenemos la URL, devolvemos cache
    if (apiUrlCache) {
      return Promise.resolve(apiUrlCache);
    }

    // Esperar a que main envíe la URL
    return new Promise<string>((resolve) => {
      ipcRenderer.once("api-url", (_event, url: string) => {
        console.log("📥 API URL recibida:", url);
        apiUrlCache = url;
        resolve(url);
      });

      // Fallback seguro
      setTimeout(() => {
        if (!apiUrlCache) {
          const fallback = "http://localhost:3005";
          console.warn("⚠️ Usando API fallback:", fallback);
          apiUrlCache = fallback;
          resolve(fallback);
        }
      }, 3000);
    });
  },

  /* ===============================
     HTTP HELPERS
  =============================== */

  api: {
    get: async (endpoint: string) => {
      const baseUrl = await (window as any).electronAPI.getApiUrl();
      const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

      console.log("📤 GET:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`GET ${res.status}`);
      }

      return res.json();
    },

    post: async (endpoint: string, data: any) => {
      const baseUrl = await (window as any).electronAPI.getApiUrl();
      const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

      console.log("📤 POST:", url, data);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`POST ${res.status}`);
      }

      return res.json();
    },
  },
});

console.log("✅ electronAPI expuesta correctamente");