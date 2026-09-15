import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  validate,
  error: externalError,
  className = '',
  ...props
}) {
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState('');

  const handleBlur = () => {
    setTouched(true);
    if (validate) {
      const error = validate(value);
      setInternalError(error || '');
    }
  };

  const handleChange = (e) => {
    onChange(e);
    if (touched && validate) {
      const error = validate(e.target.value);
      setInternalError(error || '');
    }
  };

  const error = externalError || internalError;
  const showError = touched && error;

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-2xl bg-stone-100 px-4 py-3 outline-none transition ${
            showError
              ? 'border-2 border-red-500 bg-red-50'
              : touched && !error
              ? 'border-2 border-green-500 bg-green-50'
              : 'border-2 border-transparent focus:border-amber-700'
          }`}
          {...props}
        />
        {showError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <AlertCircle size={18} />
          </div>
        )}
        {touched && !error && value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <CheckCircle2 size={18} />
          </div>
        )}
      </div>
      {showError && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

export const validators = {
  required: (value) => (!value || value.trim() === '' ? 'This field is required' : ''),
  email: (value) => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
  },
  phone: (value) => {
    if (!value) return '';
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return !phoneRegex.test(value) ? 'Please enter a valid phone number' : '';
  },
  minLength: (min) => (value) => {
    if (!value) return '';
    return value.length < min ? `Minimum ${min} characters required` : '';
  },
  minLength: (min) => (value) => {
    if (!value) return '';
    return value.length < min ? `Minimum ${min} characters required` : '';
  },
};
