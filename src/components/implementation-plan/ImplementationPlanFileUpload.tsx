'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploadProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>; 
}

const FileUpload: React.FC<FileUploadProps> = ({ setFile }) => {
  const [fileName, setFileName] = useState<string>(''); 

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; 
    if (file) {
      setFile(file); 
      setFileName(file.name); 
    } else {
      setFile(null); 
      setFileName('');
    }
  };

  return (
    <div>
      <Label htmlFor="file">Upload File</Label>
      <div className="mt-1 border-2 border-dashed rounded-lg p-4 text-center">
        <Input
          id="file"
          type="file"
          className="hidden"
          onChange={handleFileChange} 
        />
        <Label
          htmlFor="file"
          className="cursor-pointer text-sm text-muted-foreground"
        >
          {fileName || 'Click to upload or drag and drop'}
        </Label>
      </div>
    </div>
  );
};

export default FileUpload;