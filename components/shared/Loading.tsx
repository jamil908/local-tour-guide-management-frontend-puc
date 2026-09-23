import { cn } from '@/lib/utils'; // Assuming you have a utility function for combining classes

interface LoadingProps {
  color?: string; // Prop to override the spinner color (e.g., 'border-red-500')
  className?: string; // Prop for the container class (e.g., 'bg-gray-900 min-h-screen')
}

// 1. Updated to accept props
export default function Loading({ color, className }: LoadingProps) {
  // Default to a full screen, dark background, and Amber spinner.
  const baseContainerClass = 'flex items-center justify-center min-h-screen bg-gray-900';
  
  // Set default color to Amber, allowing override via 'color' prop.
  const spinnerColorClass = color || 'border-amber-500';

  return (
    // 2. Apply combined classes to the container
    <div className={cn(baseContainerClass, className)}>
      <div className="text-center">
        <div
          // 3. Apply the dynamic color class to the spinner
          className={cn(
            "inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2",
            spinnerColorClass
          )}
        ></div>
        {/* 4. Ensure text is visible in dark mode */}
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

// --- LoadingSpinner Component ---

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string; // Prop to override the spinner color
}

export function LoadingSpinner({ size = 'md', color }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  // Default to Amber border, allowing override via 'color' prop.
  const spinnerColorClass = color || 'border-amber-500';

  return (
    <div className="flex items-center justify-center">
      <div
        // 5. Apply the dynamic color and size
        className={cn(
          `inline-block animate-spin rounded-full border-t-2 border-b-2 ${sizes[size]}`,
          spinnerColorClass
        )}
      ></div>
    </div>
  );
}