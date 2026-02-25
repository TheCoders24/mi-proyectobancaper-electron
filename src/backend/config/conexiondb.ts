import sql from "mssql";

const config = {
  user: process.env.DB_USER || "DESKTOP-7FVF0T5\\ALEXIS",
  password: process.env.DB_PASSWORD || "tu_password",
  server: process.env.DB_HOST || "DESKTOP-7FVF0T5",
  database: process.env.DB_NAME || "pruebaDB",
  port: 1433,
  options: {
    encrypt: false, // Cambiar a false para local
    trustServerCertificate: true,
    trustedConnection: true, // Importante para Windows Auth
    enableArithAbort: true,
  },
};

// Exportamos un pool de conexión reutilizable
export const pool = new sql.ConnectionPool(config);
export const poolConnect = pool.connect(); // promesa de conexión