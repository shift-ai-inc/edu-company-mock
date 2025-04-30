import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  // Adjusted padding slightly for better fit
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: // Typically primary color (e.g., blue/green) - Used for '完了', 'active'
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary: // Typically gray - Used for '未完了'
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: // Typically red - Used for '期限切れ'
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: // Typically just border - Used for 'inactive'
          'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
