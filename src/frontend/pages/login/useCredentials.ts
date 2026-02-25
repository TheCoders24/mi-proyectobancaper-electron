import { useState, useEffect } from "react";

// Tipamos el objeto que devuelve el hook
interface UseCredentialsReturn {
  usuario: string;
  password: string;
  inputDisplay: string;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function useCredentials(): UseCredentialsReturn {
  const [usuarioReal, setUsuarioReal] = useState<string>("");
  const [passwordReal, setPasswordReal] = useState<string>("");
  const [inputDisplay, setInputDisplay] = useState<string>("");
  const [tienePunto, setTienePunto] = useState<boolean>(false);

  useEffect(() => {
    if (tienePunto) {
      setInputDisplay(`${usuarioReal}.${"•".repeat(passwordReal.length)}`);
    } else {
      setInputDisplay(usuarioReal);
    }
  }, [usuarioReal, passwordReal, tienePunto]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (passwordReal.length > 0) {
        setPasswordReal(prev => prev.slice(0, -1));
      } else if (tienePunto) {
        setTienePunto(false);
      } else if (usuarioReal.length > 0) {
        setUsuarioReal(prev => prev.slice(0, -1));
      }
      return;
    }

    // Solo caracteres normales (sin Ctrl o Cmd)
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();

      if (!tienePunto) {
        if (e.key === ".") {
          setTienePunto(true);
          return;
        }

        setUsuarioReal(prev => {
          if (prev.length === 0) {
            return e.key.toUpperCase();
          } else {
            return prev + e.key;
          }
        });
      } else {
        setPasswordReal(prev => prev + e.key);
      }
    }
  };

  return {
    usuario: usuarioReal,
    password: passwordReal,
    inputDisplay,
    handleKeyDown
  };
}