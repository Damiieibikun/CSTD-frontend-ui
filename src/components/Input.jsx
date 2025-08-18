import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Input = ({ name, type, placeholder, label, error, register }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = name === 'password' || name === 'passwordConfirm' || name === 'currentPassword' || name === 'newPassword';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative mb-6">
      {error && <p className="absolute -top-1 text-red-600 text-xs">{error.message}</p>}

      <div className="flex items-center justify-between">
        <input
          id={name}
         {...register(name)}
          type={inputType}
          placeholder={placeholder}
          className="text-sm p-1 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
        />
        {isPassword && (
          showPassword
            ? <FaEye onClick={() => setShowPassword(false)} className="cursor-pointer ml-2" />
            : <FaEyeSlash onClick={() => setShowPassword(true)} className="cursor-pointer ml-2" />
        )}
      </div>

      <label
        htmlFor={name}
        className="absolute left-0 -top-5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
