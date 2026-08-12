import clsx from 'clsx'

const variantStyles = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-white text-secondary border border-gray-300 hover:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </button>
  )
}

export default Button