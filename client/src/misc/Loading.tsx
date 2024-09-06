import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray1 poppins-semiboldt">
      <div className="text-center">
        <div className="w-20 h-20 border-8 border-t-8 border-t-green-500 border-neutral-700 rounded-full animate-spin"></div>{" "}
      </div>
    </div>
  );
};

export default Loading;
