import React, { useState, useEffect } from "react";

interface ChangeTextButtonProps {
  newText: string;
  labelText: string;
  resetOnChangeOf: any;
  onClick: () => void;
  pointsToRemove: number;
}

const HintButton: React.FC<ChangeTextButtonProps> = ({
  newText,
  labelText,
  resetOnChangeOf,
  onClick,
  pointsToRemove,
}) => {
  const [buttonText, setButtonText] = useState<string>(labelText);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  // Handle button click
  const handleClick = () => {
    setButtonText(newText);
    setIsChanged(true);
    onClick();
  };

  useEffect(() => {
    setButtonText(labelText);
    setIsChanged(false);
  }, [resetOnChangeOf, labelText]);

  return (
    <div>
      <div>
        <button
          className={`py-2 w-32 mx-2 rounded-md shadow-md ${
            isChanged
              ? "bg-neutral-800 text-blue-500"
              : "bg-yellow-600 hover:bg-yellow-700 text-white"
          }`}
          onClick={handleClick}
          disabled={isChanged}
        >
          {buttonText}
        </button>
      </div>
      <div>
        {!isChanged && (
          <span className="text-red-800 text-xs"> - {pointsToRemove}</span>
        )}
      </div>
    </div>
  );
};

export default HintButton;
