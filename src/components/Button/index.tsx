import './Button.css';

export const Button = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    disabled = false,
    type = 'button',
    style = {},
}: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'flat';
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    style?: React.CSSProperties;
}) => {
    return (
        <button
            className={`button ${className} ${variant}`}
            onClick={onClick}
            disabled={disabled}
            type={type}
            style={style}
        >
            {children}
        </button>
    );
}