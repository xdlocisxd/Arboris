import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.95 }}
        type="button"
        className={cn(
          'inline-flex h-12 md:h-14 items-center justify-center rounded-2xl md:rounded-3xl border-2 px-6 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50',
          selected
            ? 'border-green-600 bg-green-50 text-green-900 shadow-sm'
            : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900',
          className
        )}
        {...(props as HTMLMotionProps<"button">)}
      >
        {children}
      </motion.button>
    );
  }
);

Chip.displayName = 'Chip';

interface ChipGroupProps {
  options: { label: string; value: string }[];
  value: string | string[];
  onChange: (value: any) => void;
  multiple?: boolean;
  className?: string;
}

export function ChipGroup({ options, value, onChange, multiple, className }: ChipGroupProps) {
  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const isSelected = Array.isArray(value) && value.includes(optionValue);
      if (isSelected) {
        onChange((value as string[]).filter(v => v !== optionValue));
      } else {
        onChange([...(Array.isArray(value) ? value : []), optionValue]);
      }
    } else {
      onChange(optionValue);
    }
  };

  const isSelected = (val: string) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(val);
    }
    return value === val;
  };

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {options.map((option) => (
        <Chip
          key={option.value}
          selected={isSelected(option.value)}
          onClick={() => handleSelect(option.value)}
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );
}
