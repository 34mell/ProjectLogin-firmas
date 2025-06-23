import { getToken } from './authService';

export function uploadpdf(file) {
  const formData = new FormData();
  formData.append('archivo', file);
  
  // Obtener el token de autenticación
  const token = getToken();
  
  return fetch('http://localhost:3000/api/documentos/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
      }
      throw new Error('Error al subir el archivo');
    }
    return response.json();
  });
}

// Función para obtener documentos del usuario
export async function getUserDocuments() {
  const token = getToken();
  
  try {
    const response = await fetch('http://localhost:3000/api/documentos/usuario', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
      }
      throw new Error('Error al obtener los documentos');
    }
    
    const data = await response.json();
    return data.documentos || [];
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    throw error;
  }
}
