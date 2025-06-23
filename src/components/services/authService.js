import axios from 'axios';

// Token almacenado en memoria (en lugar de localStorage)
let inMemoryToken = null;
let inMemoryUser = null;

// Crear una instancia de axios con configuración base
export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    if (inMemoryToken) {
      config.headers['Authorization'] = `Bearer ${inMemoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y detectar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es 401 (no autorizado), limpiar los datos de sesión
    if (error.response && error.response.status === 401) {
      inMemoryToken = null;
      inMemoryUser = null;
      window.dispatchEvent(new CustomEvent('auth-error', {
        detail: { message: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.' }
      }));
    }
    return Promise.reject(error);
  }
);

// Función para crear una cookie HttpOnly (más segura)
function setSessionCookie(name, value, expiryDays = 1) {
  const date = new Date();
  date.setTime(date.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=1; ${expires}; path=/; SameSite=Strict`;
}

// Función para verificar si existe una cookie
function checkSessionCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(name + '=') === 0) {
      return true;
    }
  }
  return false;
}

// Función para eliminar una cookie
function deleteSessionCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
}

// Modificar la función loginUser
export async function loginUser({ email, password }) {
  try {
    const response = await api.post('/login', {
      email,
      password
    });

    // Guardar token y datos del usuario en memoria
    inMemoryToken = response.data.token;
    inMemoryUser = response.data.user;
    
    // Crear una cookie de sesión (sin guardar el token en ella)
    setSessionCookie('sessionActive', 1);
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al iniciar sesión';
  }
}


export async function registerUser({ nombre, apellido, email, password }) {
  try {
    const response = await api.post('/register', {
      nombre,
      apellido,
      email,
      password
    });

    // Si el registro también devuelve un token, lo almacenamos en memoria
    if (response.data.token) {
      inMemoryToken = response.data.token;
      inMemoryUser = response.data.user;
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al registrarse';
  }
}

// Función para verificar si el usuario está autenticado
export function isAuthenticated() {
  return !!inMemoryToken;
}

// Función para obtener el usuario actual
export function getCurrentUser() {
  return inMemoryUser;
}

// Función para obtener el token (para componentes que lo necesiten)
export function getToken() {
  return inMemoryToken;
}

// Función para cerrar sesión
export function logout() {
  inMemoryToken = null;
  inMemoryUser = null;
  deleteSessionCookie('sessionActive');
}

// Función para recuperar la sesión
export async function recoverSession() {
  if (checkSessionCookie('sessionActive')) {
    try {
      // endpoint para recuperar la sesión
      const response = await fetch('http://localhost:3000/api/auth/session', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${inMemoryToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        logout();
        return false;
      }

      const data = await response.json();
      inMemoryToken = data.token;
      inMemoryUser = data.user;
      
      return true;
    } catch (error) {
      console.error('Error al recuperar sesión:', error);
      logout();
      return false;
    }
  }
  
  return false;
}
