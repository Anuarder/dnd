import { type ReactElement, type ReactNode } from 'react';

function UiButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  disabled = false,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}): ReactElement {
  const sizeClasses = {
    sm: 'h-10 text-sm px-4',
    md: 'h-12 text-sm px-6',
    lg: 'h-14 text-base px-8',
  };

  const variantClasses = {
    primary:
      'border-primary bg-primary text-white active:bg-primary/90 disabled:bg-primary/50 disabled:border-primary/50',
    secondary:
      'border-white/10 bg-white/5 text-white active:bg-white/10 disabled:bg-white/5 disabled:border-white/5',
  };

  const baseClasses =
    'flex items-center justify-center gap-2 rounded-lg border font-semibold transition-all duration-200 ease-out active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && icon}
      {children}
    </button>
  );
}

export { UiButton };
