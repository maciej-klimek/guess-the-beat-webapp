import React from "react";
import { useNavigate } from "react-router-dom";


interface SummaryModalProps {
  finalScore: number;
  }
  
const SummaryModal: React.FC<SummaryModalProps> = ({finalScore}) => {
    const navigate = useNavigate();
    const handleNewGame = () => {
    navigate("/guess-by-album-cover")
    };
    const handleMenuExit = () => {
      navigate("/")
      };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">

      <div className="bg-white p-8 rounded-lg text-center">
        <div>
      <span> Your final score: {finalScore}</span>
      </div>
        <button
          onClick={handleNewGame}
          className={`mt-4 px-4 py-2 bg-green-500"rounded-md shadow-md`}
        >
          Play Again?
        </button>
        <button
          onClick={handleMenuExit}
          className={`mt-4 px-4 py-2 bg-green-500"rounded-md shadow-md`}
        >
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default SummaryModal;
