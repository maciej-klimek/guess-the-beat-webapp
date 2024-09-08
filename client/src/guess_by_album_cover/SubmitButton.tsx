import React from "react";
import { FaCheck } from "react-icons/fa";
import Tooltip from "../misc/Tooltip";

interface SubmitButtonProps {
  onSubmit: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onSubmit }) => {
  return (
    <Tooltip text="Submit!">
      {" "}
      <button onClick={onSubmit} className="p-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600">
        <FaCheck className="text-xl" />
      </button>
    </Tooltip>
  );
};

export default SubmitButton;
