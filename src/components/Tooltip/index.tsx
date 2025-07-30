import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

interface TooltipProps {
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    children: React.ReactNode;
}

export const Tooltip = ({
    content,
    position = 'top',
    delay = 500,
    children,
}: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const calculatePosition = () => {
        if (!wrapperRef.current) return { top: 0, left: 0 };

        const rect = wrapperRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        let top = 0;
        let left = 0;

        switch (position) {
            case 'top':
                top = rect.top + scrollTop - 35; // Approximate tooltip height + margin
                left = rect.left + scrollLeft + rect.width / 2;
                break;
            case 'bottom':
                top = rect.bottom + scrollTop + 8;
                left = rect.left + scrollLeft + rect.width / 2;
                break;
            case 'left':
                top = rect.top + scrollTop + rect.height / 2;
                left = rect.left + scrollLeft - 8;
                break;
            case 'right':
                top = rect.top + scrollTop + rect.height / 2;
                left = rect.right + scrollLeft + 8;
                break;
        }

        return { top, left };
    };

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
            const pos = calculatePosition();
            setTooltipPosition(pos);
            setIsVisible(true);
            // Small delay to ensure smooth animation
            setTimeout(() => setShowTooltip(true), 10);
        }, delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        setShowTooltip(false);
        // Wait for animation to complete before hiding
        setTimeout(() => setIsVisible(false), 150);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (!content) {
        return <>{children}</>;
    }

    const tooltipElement = isVisible ? (
        <div 
            className={`tooltip-portal tooltip-${position} ${showTooltip ? 'tooltip-visible' : ''}`}
            style={{ 
                top: tooltipPosition.top, 
                left: tooltipPosition.left 
            }}
            role="tooltip"
            aria-hidden={!showTooltip}
        >
            <div className="tooltip-content">
                {content}
            </div>
            <div className={`tooltip-arrow tooltip-arrow-${position}`} />
        </div>
    ) : null;

    return (
        <>
            <div 
                ref={wrapperRef}
                className="tooltip-wrapper"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>
            {tooltipElement && createPortal(tooltipElement, document.body)}
        </>
    );
};