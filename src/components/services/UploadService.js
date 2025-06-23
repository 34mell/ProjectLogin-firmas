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
    

    return (data.documentos || []).map(doc => {
      return {
        id: doc._id || doc.id,
        nombre: doc.nombre_original || doc.nombre || doc.name,
        nombre_archivo: doc.nombre_archivo || '',
        ruta: doc.ruta || '',
        tamano: doc.tamano || doc.tamaño || doc.size || 0,
        tipo_archivo: doc.tipo_archivo || doc.tipo || doc.type || 'application/pdf',
        fecha_subida: doc.fecha_subida || doc.fechaSubida || doc.uploadDate,
        usuario_id: doc.usuario_id || doc.usuarioId,
        estado: doc.estado || 'READY',
        firmado: !!doc.firmadoPor,
        firmadoPor: doc.firmadoPor || doc.signedBy,
        fechaFirma: doc.fechaFirma || doc.signedDate
      };
    });
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    throw error;
  }
}

// Actualizar la función de firma para incluir correctamente la contraseña
export async function signDocument(documentId, certificateId, password) {
  const token = getToken();
  
  try {
    const response = await fetch(`http://localhost:3000/api/documentos/${documentId}/firmar`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        certificadoId: certificateId,
        password: password // Añadir la contraseña al cuerpo de la solicitud
      })
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
      }
      const errorData = await response.json();
      throw new Error(errorData.mensaje || 'Error al firmar el documento');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al firmar documento:', error);
    throw error;
  }
}
