declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

export {};

declare global {
  interface Window {
    electronAPI: {
      /* ===== Electron / Sistema ===== */
      obtenerNombreDeEquipo: () => Promise<string>;

      /* ===== API backend ===== */
      getApiUrl: () => Promise<string>;

      api: {
        get: (endpoint: string) => Promise<any>;
        post: (endpoint: string, data: any) => Promise<any>;
        put: (endpoint: string, data: any) => Promise<any>;
        delete: (endpoint: string) => Promise<any>;
      };
    };
  }
}