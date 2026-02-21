import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, noPadding = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-background-card border border-border-light rounded-lg overflow-hidden',
          className
        )}
        {...props}
      >
        {noPadding ? children : (
          <div className="p-6">{children}</div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'px-6 py-4 border-b border-border-light font-medium',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

export const CardBody = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardBody.displayName = 'CardBody';

export default Card;
