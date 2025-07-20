import './Button.css';

export const Button = ({
    children,
    onClick,
    className = '',
    disabled = false,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}) => {
    return (
        <button
            className={`button ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}