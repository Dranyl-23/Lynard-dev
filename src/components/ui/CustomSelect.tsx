import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  name?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  required = false,
  name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {name && <input type="hidden" name={name} value={value} required={required} />}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-2xl border border-line bg-white px-5 py-3.5 text-left text-sm text-ink transition-all duration-500 focus:border-ink focus:ring-2 focus:ring-ink/10"
      >
        <span className={value ? 'text-ink font-medium' : 'text-muted/60'}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="custom-scrollbar pill-shadow absolute inset-x-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-line bg-white p-1.5 pr-2 backdrop-blur-xl">
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-ink text-white'
                    : 'text-ink hover:bg-paper'
                }`}
              >
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
