import React from "react";

interface StartGameButtonProps {
  onStartGame: () => void;
}

const StartGameButton: React.FC<StartGameButtonProps> = ({ onStartGame }) => {
  return (
    <button
      onClick={onStartGame}
      className="mt-10 px-20 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
    >
      Guess!
    </button>
  );
};

export default StartGameButton;
