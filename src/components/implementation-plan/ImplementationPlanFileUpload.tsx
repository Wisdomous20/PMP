'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploadProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>; // Adjust the type as needed
}

const FileUpload: React.FC<FileUploadProps> = ({ setFile }) => {
  const [fileName, setFileName] = useState<string>(''); // To display the name of the selected file

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file) {
      setFile(file); // Update the parent component with the selected file
      setFileName(file.name); // Update the local state to display the file name
    } else {
      setFile(null); // Reset if no file is selected
      setFileName(''); // Reset the file name
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
          onChange={handleFileChange} // Handle file selection
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