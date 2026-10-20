import React from 'react';

interface MandatoryReasonInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
}

export const MandatoryReasonInput: React.FC<MandatoryReasonInputProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Explain why this attendance record is being changed.',
  label = 'Reason for modification *'
}) => {
  const trimmedLength = value.trim().length;
  const isTooShort = value.length > 0 && trimmedLength < 5;
  const isTooLong = value.length > 500;
  const isValid = trimmedLength >= 5 && trimmedLength <= 500;

  return (
    <div className="flex flex-col gap-1.5 border-t border-slate-800/80 pt-4">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
          {label}
        </label>
        <span
          className={`text-[11px] font-mono ${
            isTooLong
              ? 'text-red-400 font-bold'
              : isValid
              ? 'text-emerald-400'
              : 'text-slate-400'
          }`}
        >
          {trimmedLength} / 500 chars (min 5)
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={3}
        className={`w-full bg-slate-950 border text-slate-200 rounded-xl p-3 text-sm focus:outline-none transition-colors resize-none ${
          isTooShort || isTooLong
            ? 'border-red-500/50 focus:border-red-500'
            : isValid
            ? 'border-emerald-500/30 focus:border-indigo-500'
            : 'border-slate-800 focus:border-indigo-500'
        }`}
      />

      {isTooShort && (
        <p className="text-[11px] text-red-400 font-medium">
          Please enter at least 5 non-whitespace characters explaining this modification.
        </p>
      )}

      {isTooLong && (
        <p className="text-[11px] text-red-400 font-medium">
          Reason cannot exceed 500 characters.
        </p>
      )}

      {!value && (
        <p className="text-[11px] text-slate-400">
          Reason is mandatory to log this action in the audit history.
        </p>
      )}
    </div>
  );
};

export default MandatoryReasonInput;
