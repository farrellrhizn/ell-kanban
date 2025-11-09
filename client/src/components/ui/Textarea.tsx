import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, style, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn('task-input', className)}
      style={{ minHeight: '120px', resize: 'vertical', ...style }}
      {...props}
    />
  )
);

Textarea.displayName = 'Textarea';

export default Textarea;
