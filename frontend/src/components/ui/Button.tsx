import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'massive';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96 }}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50 select-none touch-manipulation',
          {
            'bg-green-600 text-stone-50 hover:bg-green-700 shadow-sm': variant === 'primary',
            'bg-stone-200 text-stone-900 hover:bg-stone-300': variant === 'secondary',
            'border-2 border-stone-200 bg-transparent hover:bg-stone-100 text-stone-900': variant === 'outline',
            'hover:bg-stone-100 text-stone-900': variant === 'ghost',
          },
          {
            'h-9 px-4 text-sm rounded-xl': size === 'sm',
            'h-12 px-6 text-base rounded-2xl': size === 'md',
            'h-14 px-8 text-lg rounded-2xl': size === 'lg',
            'h-16 px-10 text-xl w-full rounded-2xl': size === 'massive',
          },
          className
        )}
        {...(props as HTMLMotionProps<"button">)}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
