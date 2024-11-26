'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled
}: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onChange(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    disabled
  });

  return (
    <div>
      {value ? (
        <div className='relative h-[200px] w-full overflow-hidden rounded-lg'>
          <div className='absolute right-2 top-2 z-10'>
            <button
              type='button'
              onClick={onRemove}
              className='rounded-full bg-rose-500 p-1 text-white hover:bg-rose-600 focus:outline-none'
            >
              <X className='size-4' />
            </button>
          </div>
          <Image src={value} alt='Upload' className='object-cover' fill />
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'relative flex h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100',
            isDragActive && 'border-primary bg-primary/10',
            disabled && 'cursor-not-allowed opacity-50 hover:bg-gray-50'
          )}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center justify-center gap-2 text-sm text-gray-600'>
            <p>Drag & drop an image here, or click to select</p>
            <p className='text-xs text-gray-500'>
              Supported formats: PNG, JPG, JPEG, GIF
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
