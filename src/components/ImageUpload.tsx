import React, { useState, useEffect } from 'react';

interface ImageUploadProps {
  handleImageUpload: (files: File[]) => void;
  handleImageRemove: (index: number) => void;
  images: string[];
}

const ImageUploadComponent: React.FC<ImageUploadProps> = ({ handleImageUpload, handleImageRemove, images }) => {
  const [uploadedLinks, setUploadedLinks] = useState<string[]>([]);

  useEffect(() => {
    if (images) {
      setUploadedLinks(images);
    }
  }, [images]);

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    await handleImageUpload(files);
  };

  const removeImage = (index: number) => {
    const updatedLinks = uploadedLinks.filter((_, i) => i !== index);
    setUploadedLinks(updatedLinks);
    handleImageRemove(index);
  };

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={onUpload} />
      <div>Upload up to 5 images</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', border: '2px dotted', gap: '1em', borderRadius: '10px', padding: '10px' }}>
        {uploadedLinks.map((link, index) => (
          <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
              <>
                <img src={link} alt={`Preview ${index}`} width="120" height="120" />
                <button
                  onClick={() => removeImage(index)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    padding: '8px',
                    margin: '10px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                >
                  <svg
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                  >
                    <path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-200 0H360v-72h304v72z" />
                  </svg>
                </button>
              </>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploadComponent;
