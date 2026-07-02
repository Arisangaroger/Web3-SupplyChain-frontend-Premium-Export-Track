"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Render value in monospace (tracking codes, IDs, periods). */
  mono?: boolean;
}

export function Input({ label, className = "", id, mono = false, type, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const isPassword = type === "password";
  const [visible, setVisible] = useState(false);

  const inputClassName = `type-body w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 ${
    mono ? "font-data tracking-tight" : ""
  } ${isPassword ? "pr-10" : ""} ${className}`;

  return (
    <label htmlFor={inputId} className="block space-y-1">
      <span className="eyebrow text-slate-600">{label}</span>
      {isPassword ? (
        <div className="relative">
          <input
            id={inputId}
            type={visible ? "text" : "password"}
            className={inputClassName}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-slate-600"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
          >
            {visible ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      ) : (
        <input id={inputId} type={type} className={inputClassName} {...props} />
      )}
    </label>
  );
}
