import { api, getToken } from './authService';

export async function uploadCertificate(file, password) {
  const formData = new FormData();
  formData.append('certificado', file);
  formData.append('password', password);
  
  try {
    const response = await fetch('http://localhost:3000/api/certificados/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || 'Error al subir el certificado');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al subir certificado:', error);
    throw error;
  }
}

export async function getUserCertificates() {
  try {
    const response = await api.get('/certificados/usuario');
    return response.data.certificados || [];
  } catch (error) {
    console.error('Error al obtener certificados:', error);
    throw error;
  }
}