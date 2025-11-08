import { forwardRef } from 'react';

const Textarea = forwardRef(({ className = '', ...props }, ref) => (
  <textarea
    ref={ref}
    className={`task-input ${className}`}
    style={{ minHeight: '100px', resize: 'vertical' }}
    {...props}
  />
));

Textarea.displayName = 'Textarea';

export default Textarea;
