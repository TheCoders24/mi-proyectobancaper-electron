export interface AuthSession {
  accessToken: string;
  user: {
    username: string;
    role: string;
    empresaId: string;
    perfilId?: string;
    sucursalId?: string;
  };
}

export interface LoginInput {
  empresaId: string | number;
  perfilId?: string | number;
  sucursalId?: string | number;
  usuario: string;
  password: string;
}




