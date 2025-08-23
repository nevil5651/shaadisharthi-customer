import React from 'react';

interface InputFieldProps {
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  name: string;
  required?: boolean;
  label?: string; // Added label prop
  value: string; // Added value prop
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Added onChange prop
}

export default function InputField({ icon, type = 'text', placeholder, name, required = false, label, value, onChange }: InputFieldProps) {
  return (
    <div className="mb-5">
      <div className="relative">
        <div className="input-icon">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className="form-input"
        />
      </div>
    </div>
  );
}