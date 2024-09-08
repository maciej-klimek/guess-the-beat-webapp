import React from "react";

interface ChancesDisplayProps {
  emptyHeartsCount: number;
}

const Hearts: React.FC<ChancesDisplayProps> = ({ emptyHeartsCount }) => {
  const squares = Array.from({ length: 5 }).map((_, index) => (
    <div key={index} className={`w-6 h-6 mx-1 mt-4 ${index < emptyHeartsCount ? "bg-red-500" : "bg-gray3"} rounded`} />
  ));

  return <div className=" flex justify-center mb-2">{squares}</div>;
};

export default Hearts;
