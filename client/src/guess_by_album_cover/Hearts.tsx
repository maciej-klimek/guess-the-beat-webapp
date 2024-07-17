import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface HeartsProps {
  emptyHeartsCount: number;
  heartsCount: number;
}

const Hearts: React.FC<HeartsProps> = ({ emptyHeartsCount, heartsCount }) => {
  return (
    <div className="mt-4 flex">
      {Array.from({ length: emptyHeartsCount }, (_, index) => (
        <FaRegHeart key={index} className="text-red-600 mr-1" />
      ))}
      {Array.from({ length: heartsCount }, (_, index) => (
        <FaHeart key={index} className="text-red-600 mr-1" />
      ))}
    </div>
  );
};

export default Hearts;
