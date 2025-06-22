
export function uploadpdf(file) {
  const formData = new FormData();
  formData.append('archivo', file);

  return fetch('http://localhost:3000/api/documentos/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('File upload failed');
    }
    return response.json();
  });
}
