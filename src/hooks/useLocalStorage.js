
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Estado para almacenar nuestro valor
  // Pasa la función de inicialización a useState para que la lógica
  // solo se ejecute una vez
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Obtener del localStorage por clave
      const item = window.localStorage.getItem(key);
      // Analizar JSON almacenado o si no existe devolver initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay error devolver initialValue
      console.log(error);
      return initialValue;
    }
  });
  
  // Devolver una versión envuelta de la función setter de useState que ...
  // ... persiste el nuevo valor en localStorage.
  const setValue = (value) => {
    try {
      // Permitir que value sea una función para que tengamos la misma API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Guardar estado
      setStoredValue(valueToStore);
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Una implementación más avanzada manejaría el caso de error
      console.log(error);
    }
  };
  
  return [storedValue, setValue];
}
