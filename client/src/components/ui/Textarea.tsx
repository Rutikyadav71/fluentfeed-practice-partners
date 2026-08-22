import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = "", ...rest }, ref) => {
    const areaId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={areaId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <textarea
          id={areaId}
          ref={ref}
          rows={4}
          className={`resize-none rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-brand-500 ${
            error ? "border-red-400" : "border-gray-300"
          } ${className}`}
          {...rest}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
