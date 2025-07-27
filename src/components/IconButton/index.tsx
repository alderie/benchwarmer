import React from 'react';
import './IconButton.css';

export const IconButton = ({
    icon: Icon,
    onClick,
    className,
    style,
}: {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    onClick: () => void;
    className?: string;
    style?: React.CSSProperties;
}) => {
    return (
        <button className={`icon-button ${className}`} onClick={onClick} style={style}>
            <Icon className="icon" />
        </button>
    );
};
