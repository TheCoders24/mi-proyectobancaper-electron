import sql from "mssql";

const config: sql.config = {
  server: process.env.DB_HOST || "DESKTOP-7FVF0T5",
  database: process.env.DB_NAME || "pruebaDB",
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "12345",
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

export const pool = new sql.ConnectionPool(config);
export const poolConnect = pool.connect();

export { sql };