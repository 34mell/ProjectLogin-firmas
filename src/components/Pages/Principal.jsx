import React from 'react';
import Header from '../ui/Header';
import DocumentUpload from '../ui/DocumentUpload';
import DocumentList from '../ui/DocumentList';
import DocumentPreview from '../ui/DocumentPreview';
import StatsCards from '../ui/StatsCards';
import Notification from '../ui/Notification';
import { createDocument, DocumentStatus } from '../ui/types';
import { uploadpdf } from '../services/UploadService';
import { useState } from 'react';

function Principal() {
  const [documents, setDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewDocument, setPreviewDocument] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

 
  const handleFileUpload = async (files) => {
    showNotification('success', `Subiendo ${files.length} archivo${files.length > 1 ? 's' : ''}...`);

    const uploadPromises = files.map(async (file) => {
      try {
        const document = await uploadpdf(file);
        setDocuments(prev => [...prev, document]);
        return document;
      } catch (error) {
        console.error('Error uploading file:', error);
        showNotification('error', `Error al subir ${file.name}`);
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
            signedBy: 'Usuario Demo',
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
            <DocumentList
              documents={documents}
              onPreview={handlePreview}
              onDelete={handleDelete}
              onSign={handleSign}
            />
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