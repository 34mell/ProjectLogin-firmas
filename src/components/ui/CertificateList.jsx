import React from 'react';
import { Shield, CheckCircle2, Trash2, Key } from 'lucide-react';
import { formatDate } from './types';

const CertificateList = ({ certificates, onDelete }) => {
  if (!certificates || certificates.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="p-6 bg-gray-50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <Key className="w-12 h-12 text-gray-300" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-3">No hay certificados</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Sube tu certificado digital .p12 para poder firmar documentos electrónicamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">
          Tu Certificado Digital
        </h3>
      </div>
      
      <div className="grid gap-4">
        {certificates.map((certificate) => {
          const fullPath = certificate.nombre || certificate.name || '';
          const fileName = fullPath.split('\\').pop().split('/').pop();
          
          return (
            <div key={certificate.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-800 truncate mb-2">
                      {fileName || "Certificado digital"}
                    </h4>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span className="font-medium">
                        {certificate.emisor || 'Sistema de Firma Digital'}
                      </span>
                      <span>•</span>
                      <span>
                        {certificate.fechaSubida ? 
                          `Subido el ${formatDate(new Date(certificate.fechaSubida))}` : 
                          'Fecha desconocida'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Certificado activo</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onDelete(certificate.id)}
                    className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200"
                    title="Eliminar certificado"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CertificateList;