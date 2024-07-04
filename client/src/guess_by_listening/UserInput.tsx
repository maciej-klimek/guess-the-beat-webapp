import React from "react";

interface UserInputProps {
    userGuess: string;
    setUserGuess: (guess: string) => void;
}

const UserInput: React.FC<UserInputProps> = ({ userGuess, setUserGuess }) => {
    return (
        <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            className="mt-4 mb-4 px-4 py-2 rounded-md w-11/12 bg-gray3 text-center text-neutral-300 placeholder-neutral-600"
            placeholder="What the title of this song? 🤔"
        />
    );
};

export default UserInput;
