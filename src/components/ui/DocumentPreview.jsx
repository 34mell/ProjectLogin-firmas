import React from 'react';
import { X, Download, FileText, Image, PenTool } from 'lucide-react';
import { formatFileSize, formatDate, DocumentStatus } from './types';

const DocumentPreview = ({ document, onClose, onSign }) => {
  if (!document) return null;

  const isPDF = document.type === 'application/pdf';
  const isImage = document.type.startsWith('image/');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              {isImage ? (
                <Image className="w-6 h-6 text-blue-600" />
              ) : (
                <FileText className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{document.name}</h3>
              <p className="text-sm text-gray-500">
                {formatFileSize(document.size)} • Subido el {formatDate(document.uploadDate)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {document.status === DocumentStatus.READY && (
              <button
                onClick={() => {
                  onSign(document.id);
                  onClose();
                }}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <PenTool className="w-4 h-4" />
                <span className="font-medium">Firmar</span>
              </button>
            )}
            
            <button
              className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200"
              title="Descargar"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Descargar</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              title="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-auto bg-gray-50">
          {isPDF ? (
            <div className="text-center py-16">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-md mx-auto">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-700 mb-3">Vista previa de PDF</h4>
                <p className="text-gray-500 mb-6">
                  La vista previa completa de PDF requiere descarga del archivo
                </p>
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl mx-auto transition-all duration-200 shadow-sm hover:shadow-md">
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Descargar PDF</span>
                </button>
              </div>
            </div>
          ) : isImage && document.url ? (
            <div className="text-center">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 inline-block">
                <img
                  src={document.url}
                  alt={document.name}
                  className="max-w-full max-h-96 object-contain rounded-xl"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-md mx-auto">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-700 mb-3">Vista previa no disponible</h4>
                <p className="text-gray-500">
                  Este tipo de archivo no se puede previsualizar en el navegador
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;