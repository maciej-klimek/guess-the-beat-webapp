import React from "react";

interface ChancesDisplayProps {
  emptyHeartsCount: number;
}

const Hearts: React.FC<ChancesDisplayProps> = ({ emptyHeartsCount }) => {
  const squares = Array.from({ length: 5 }).map((_, index) => (
    <div
      key={index}
      className={`p-4 mx-2 mt-4 ${
        index < emptyHeartsCount ? "bg-red-500" : "bg-gray3"
      } rounded`}
    />
  ));

  return <div className="flex justify-center mb-2">{squares}</div>;
};

export default Hearts;
