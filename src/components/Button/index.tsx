import './Button.css';

export const Button = ({
    children,
    onClick,
    className = '',
    disabled = false,
    type = 'button',
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}) => {
    return (
        <button
            className={`button ${className}`}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {children}
        </button>
    );
}