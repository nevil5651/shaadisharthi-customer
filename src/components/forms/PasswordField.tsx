import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

interface PasswordFieldProps {
  placeholder?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  placeholder,
  name,
  value,
  onChange,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-5">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {placeholder}
      </label>
      <div className="relative">
        <div className="input-icon">
          <FaLock />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          className="form-input pr-10"
          value={value}
          onChange={onChange}
        />
        <button 
          type="button" 
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;