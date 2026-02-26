import { pool, poolConnect, sql } from "../../../config/conexiondb";

export class SqlServerConnection {
  async executeStoredProcedure(
    spName: string,
    params: Record<string, any>
  ) {
    await poolConnect;

    const request = pool.request();

    for (const key in params) {
      request.input(key, params[key]);
    }

    return request.execute(spName);
  }
}