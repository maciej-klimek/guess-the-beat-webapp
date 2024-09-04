import React, { useState } from 'react';

interface ChangeTextButtonProps {
  newText: string;
}

const HintButton: React.FC<ChangeTextButtonProps> = ({newText }) => {
  // Step 1: Set initial text
  const [buttonText, setButtonText] = useState<string>("Hint");

  // Step 2: Handle button click
  const handleClick = () => {
    // Change the button text to the new text passed as a prop
    setButtonText(newText);
  };

  // Step 3: Render the button
  return (
    <button className="p-2 bg-yellow-500 hover:bg-slate-600 text-white rounded-lg ml-4" onClick={handleClick}>
      {buttonText}
    </button>
  );
};

export default HintButton;
