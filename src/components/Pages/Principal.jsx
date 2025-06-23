import React, { useEffect } from 'react';
import Header from '../ui/Header';
import DocumentUpload from '../ui/DocumentUpload';
import DocumentList from '../ui/DocumentList';
import DocumentPreview from '../ui/DocumentPreview';
import StatsCards from '../ui/StatsCards';
import Notification from '../ui/Notification';
import { DocumentStatus } from '../ui/types';
import { uploadpdf, getUserDocuments } from '../services/UploadService';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function Principal() {
  const [documents, setDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewDocument, setPreviewDocument] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const userDocuments = await getUserDocuments();
        
        // Mapear los documentos del backend al formato que espera la UI
        const formattedDocuments = userDocuments.map(doc => {
          // Intentar crear objetos Date válidos, con fallback a null si la fecha es inválida
          let uploadDate = null;
          let signedDate = null;
          
          try {
            if (doc.fechaSubida || doc.uploadDate) {
              uploadDate = new Date(doc.fechaSubida || doc.uploadDate);
              // Verificar si la fecha es válida
              if (isNaN(uploadDate.getTime())) uploadDate = null;
            }
            
            if (doc.fechaFirma || doc.signedDate) {
              signedDate = new Date(doc.fechaFirma || doc.signedDate);
              // Verificar si la fecha es válida
              if (isNaN(signedDate.getTime())) signedDate = null;
            }
          } catch (e) {
            console.error('Error al procesar fechas:', e);
          }
          
          return {
            id: doc._id || doc.id,
            name: doc.nombre || doc.name,
            size: doc.tamaño || doc.size || 0,
            type: doc.tipo || doc.type || 'application/pdf',
            uploadDate: uploadDate,
            status: doc.estado || doc.status || DocumentStatus.READY,
            url: doc.url,
            signedBy: doc.firmadoPor || doc.signedBy,
            signedDate: signedDate
          };
        });
        
        setDocuments(formattedDocuments);
        
        if (formattedDocuments.length > 0) {
          showNotification('success', `Se cargaron ${formattedDocuments.length} documentos`);
        }
      } catch (error) {
        console.error('Error al cargar documentos:', error);
        showNotification('error', 'No se pudieron cargar tus documentos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Bienvenida al usuario
  useEffect(() => {
    if (currentUser) {
      showNotification('success', `Bienvenido, ${currentUser.firstName || currentUser.nombre} ${currentUser.lastName || currentUser.apellido}`);
    }
  }, [currentUser]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileUpload = async (files) => {
    showNotification('success', `Subiendo ${files.length} archivo${files.length > 1 ? 's' : ''}...`);

    // Inicializar progreso para cada archivo
    const newUploadProgress = {};
    files.forEach(file => {
      newUploadProgress[file.name] = 0;
    });
    setUploadProgress(newUploadProgress);

    const uploadPromises = files.map(async (file) => {
      try {
        // Simular progreso de carga
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: Math.min(progress, 90)
          }));
        }, 300);

        // Subir el archivo al servidor
        const response = await uploadpdf(file);
        
        // Completar progreso
        clearInterval(interval);
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 100
        }));

        // Crear documento con datos del servidor
        const newDocument = {
          id: response._id || response.id || Math.random().toString(36).substr(2, 9),
          name: response.nombre || file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date(),
          status: DocumentStatus.READY,
          url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          signedBy: null,
          signedDate: null
        };

        // Agregar el nuevo documento a la lista
        setDocuments(prev => [...prev, newDocument]);
        
        setTimeout(() => {
          setUploadProgress(prev => {
            const { [file.name]: _, ...rest } = prev;
            return rest;
          });
        }, 1000);

        return newDocument;
      } catch (error) {
        console.error('Error uploading file:', error);
        showNotification('error', `Error al subir ${file.name}: ${error.message}`);
        
        setUploadProgress(prev => {
          const { [file.name]: _, ...rest } = prev;
          return rest;
        });
        
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successCount = results.filter(Boolean).length;
    
    if (successCount > 0) {
      showNotification('success', `${successCount} archivo${successCount > 1 ? 's' : ''} subido${successCount > 1 ? 's' : ''} correctamente`);
    }
  };

  const handlePreview = (document) => {
    setPreviewDocument(document);
  };

  const handleDelete = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    showNotification('success', 'Documento eliminado correctamente');
  };

  const handleSign = (id) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id 
        ? { 
            ...doc, 
            status: DocumentStatus.SIGNED, 
            signedBy: currentUser ? `${currentUser.firstName || currentUser.nombre} ${currentUser.lastName || currentUser.apellido}` : 'Usuario',
            signedDate: new Date()
          }
        : doc
    ));
    showNotification('success', 'Documento firmado correctamente');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Notification */}
      <Notification 
        notification={notification} 
        onClose={() => setNotification(null)} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <StatsCards documents={documents} />

        <div className="space-y-8">
          {/* Upload Section */}
          <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <DocumentUpload 
              onFileUpload={handleFileUpload}
              uploadProgress={uploadProgress}
            />
          </section>

          {/* Documents List */}
          <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-3 text-gray-600">Cargando documentos...</p>
              </div>
            ) : (
              <DocumentList
                documents={documents}
                onPreview={handlePreview}
                onDelete={handleDelete}
                onSign={handleSign}
              />
            )}
          </section>
        </div>
      </main>

      {/* Preview Modal */}
      <DocumentPreview
        document={previewDocument}
        onClose={() => setPreviewDocument(null)}
        onSign={handleSign}
      />
    </div>
  );
}

export default Principal;