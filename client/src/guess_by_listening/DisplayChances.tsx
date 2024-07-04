import React from "react";

interface ChancesDisplayProps {
    remainingChances: number;
}

const ChancesDisplay: React.FC<ChancesDisplayProps> = ({ remainingChances }) => {
    const squares = Array.from({ length: 5 }).map((_, index) => (
        <div
            key={index}
            className={`w-4 h-4 mx-1 ${index < 5 - remainingChances ? 'bg-red-500' : 'bg-gray3'} rounded`}
        />
    ));

    return (
        <div className="flex justify-center mb-2">
            {squares}
        </div>
    );
};

export default ChancesDisplay;
