import '@pqina/pintura/pintura.css';
import React, { useState } from 'react';
import { getEditorDefaults } from '@pqina/pintura';
import { PinturaEditor } from '@pqina/react-pintura';

const EditImages = () => {
  const [src, setSrc] = useState<string | undefined>(undefined);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSrc(URL.createObjectURL(file));
    }
  };

  const downloadImage = (imageBlob: Blob) => {
    const url = URL.createObjectURL(imageBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'edited-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: '80vh', backgroundColor: '#1e1e1e', color: '#ffffff', padding: '20px' }}>
      {!src && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            style={{ color: '#ffffff' }}
          />
        </div>
      )}

      {src && (
        <PinturaEditor
          {...getEditorDefaults()}
          src={src}
          onProcess={(res) => {
            downloadImage(res.dest);
            setSrc(undefined);
          }}
          onClose={() => {
            setSrc(undefined);
          }}
        />
      )}
    </div>
  );
};

export default EditImages;
