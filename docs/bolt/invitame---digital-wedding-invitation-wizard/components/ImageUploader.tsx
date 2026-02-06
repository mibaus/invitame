
import React, { useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  maxSizeMB?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, value, onChange, maxSizeMB = 5 }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`La imagen es muy pesada. Máximo ${maxSizeMB}MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-[10px] uppercase tracking-widest font-bold text-[#A27B5C] mb-2">{label}</label>
      
      {value ? (
        <div className="relative group overflow-hidden rounded-2xl border border-gray-100 shadow-sm aspect-video">
          <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-white rounded-full text-[#2C3333] hover:text-[#A27B5C] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button 
              onClick={() => onChange('')}
              className="p-3 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 flex flex-col items-center justify-center group hover:border-[#A27B5C] hover:bg-[#E7D2CC]/10 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#A27B5C] mb-3 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#2C3333]">Subir Imagen</span>
          <span className="text-[9px] text-gray-400 mt-1">JPG, PNG hasta {maxSizeMB}MB</span>
        </button>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

export default ImageUploader;
