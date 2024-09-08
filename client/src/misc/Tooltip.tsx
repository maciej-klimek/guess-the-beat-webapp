import React from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      {/* Tooltip appears when hovering over the children (parent div) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-10 whitespace-nowrap bg-neutral-700 text-white text-xs rounded-md px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
