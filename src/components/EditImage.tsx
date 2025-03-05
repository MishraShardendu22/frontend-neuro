import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImagePlus, X, Camera, ImageIcon } from 'lucide-react';
import { getEditorDefaults } from '@pqina/pintura';
import { PinturaEditor } from '@pqina/react-pintura';
import toast from 'react-hot-toast';

const EditImages: React.FC = () => {
  const [src, setSrc] = useState<string | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);

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
    toast.success('Image downloaded successfully!');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSrc(URL.createObjectURL(file));
    } else {
      toast.error('Please drop an image file');
    }
  };

  return (
    <Card className="w-full bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <ImageIcon className="w-6 h-6" />
          Image Editor
        </CardTitle>
        <CardDescription className="text-gray-400">
          Edit and enhance your images with ease
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          className={`
            w-full h-[500px] border-2 border-dashed rounded-lg flex flex-col 
            items-center justify-center transition-colors duration-300
            ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-800'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!src ? (
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="
                  flex flex-col items-center justify-center cursor-pointer
                  p-6 rounded-lg hover:bg-gray-900 transition-colors
                "
              >
                <ImagePlus className="w-12 h-12 text-primary mb-4" />
                <p className="text-white mb-2">Drag and drop an image or click to upload</p>
                <p className="text-gray-400 text-sm">Supports: PNG, JPG, WEBP</p>
              </label>
              <div className="mt-4 flex justify-center gap-4">
                <Button
                  variant="outline"
                  className="bg-gray-900 text-white border-gray-800 hover:bg-gray-800"
                >
                  <Camera className="mr-2 h-4 w-4" /> Take Photo
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative">
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
                className="w-full h-full"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4 z-50"
                onClick={() => setSrc(undefined)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EditImages;
