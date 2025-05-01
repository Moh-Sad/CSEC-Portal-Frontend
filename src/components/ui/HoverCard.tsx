"use client";

import { useState, useRef, useEffect } from "react";

interface HoverCardProps {
  children: React.ReactNode;
  content: React.ReactNode;
  delay?: number;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function HoverCard({
  children,
  content,
  delay = 300,
  position = "bottom",
  className = "",
}: HoverCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        });
        setIsVisible(true);
      }
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getPositionStyles = () => {
    const offset = 8;
    switch (position) {
      case "top":
        return {
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginBottom: `${offset}px`,
        };
      case "bottom":
        return {
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: `${offset}px`,
        };
      case "left":
        return {
          right: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          marginRight: `${offset}px`,
        };
      case "right":
        return {
          left: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          marginLeft: `${offset}px`,
        };
      default:
        return {};
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          className={`absolute z-50 min-w-[200px] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-3 transition-opacity duration-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={getPositionStyles()}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {content}
          {/* Arrow/triangle indicator */}
          <div
            className={`absolute w-3 h-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rotate-45 ${
              position === "top"
                ? "bottom-[-4px] left-1/2 -translate-x-1/2 border-r-0 border-t-0"
                : position === "bottom"
                ? "top-[-4px] left-1/2 -translate-x-1/2 border-l-0 border-b-0"
                : position === "left"
                ? "right-[-4px] top-1/2 -translate-y-1/2 border-r-0 border-b-0"
                : "left-[-4px] top-1/2 -translate-y-1/2 border-l-0 border-t-0"
            }`}
          />
        </div>
      )}
    </div>
  );
}