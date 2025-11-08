import { forwardRef } from 'react';

const Input = forwardRef(({ className = '', type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={`task-input ${className}`}
    {...props}
  />
));

Input.displayName = 'Input';

export default Input;
