import { forwardRef } from 'react';
import { cn } from '../../lib/cn.js';

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variantClass = {
  primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 active:scale-95 focus-visible:outline-[var(--ring)]',
  secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-90 active:scale-95 focus-visible:outline-[var(--ring)]',
  outline: 'border-2 border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] active:scale-95 focus-visible:outline-[var(--ring)]',
  ghost: 'bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] active:scale-95',
  destructive: 'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:opacity-90 active:scale-95 focus-visible:outline-[var(--destructive)]'
};

const sizeClass = {
  sm: 'h-8 px-3 py-1.5 text-xs',
  md: 'h-10 px-4 py-2',
  lg: 'h-12 px-6 py-3',
  icon: 'h-10 w-10 p-0'
};

const Button = forwardRef(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(baseClass, variantClass[variant] ?? variantClass.primary, sizeClass[size] ?? sizeClass.md, className)}
      {...props}
    />
  )
);

Button.displayName = 'Button';

export default Button;
