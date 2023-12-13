import { InputHTMLAttributes, LabelHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface iInputProps extends InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  registerName?: any;
  error?: string;
  register?: UseFormRegisterReturn<any>;
}

const InputComponent = ({
  labelText,
  className,
  register,
  error,
  ...props
}: iInputProps) => {
  return (
    <div className="text-start my-2">
      <label className="w-full">
        {labelText}
        <input
          {...props}
          {...register}
          className={twMerge("w-full border-2 p-2 rounded", className)}
        />
      </label>
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
    </div>
  );
};

export default InputComponent;
