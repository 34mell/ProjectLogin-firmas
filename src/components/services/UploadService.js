
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
