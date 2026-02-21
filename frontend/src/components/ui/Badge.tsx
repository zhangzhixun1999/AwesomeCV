import { HTMLAttributes } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'hot' | 'new' | 'secondary';
  onRemove?: () => void;
}

const Badge = ({ className, children, variant = 'default', onRemove, ...props }: BadgeProps) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    hot: 'bg-red-500 text-white',
    new: 'bg-green-500 text-white',
    secondary: 'bg-gray-200 text-gray-600',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity"
        >
          <X size={14} />
        </button>
      )}
    </span>
  );
};

export default Badge;
