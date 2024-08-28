import React from "react";

interface SubmitButtonProps {
  onSubmit: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onSubmit }) => {
  return (
    <button
      onClick={onSubmit}
      className="p-2 bg-blue-500 hover:bg-slate-600 text-white rounded-lg ml-4"
    >
      Submit
    </button>
  );
};

export default SubmitButton;
