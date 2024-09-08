import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface SettingsProps {
  userImage: string | null;
  userScore: number | null;
}

const Settings: React.FC<SettingsProps> = ({ userImage, userScore }) => {
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [displayedImage, setDisplayedImage] = useState("user_icon.jpg");

  const toggleSettingsMenu = () => {
    setIsSettingsMenuOpen(!isSettingsMenuOpen);
  };

  useEffect(() => {
    const checkImage = () => {
      if (userImage) {
        const img = new Image();
        img.src = userImage;
        img.onload = () => {
          setDisplayedImage(userImage);
        };
        img.onerror = () => {
          setDisplayedImage("user_icon.png");
        };
      } else {
        setDisplayedImage("user_icon.png");
      }
    };

    checkImage();
  }, [userImage]);
  return (
    <div className="absolute top-8 right-8 transition-transform duration-300 ease-in-out transform hover:scale-105">
      <button onClick={toggleSettingsMenu}>
        <div className="flex items-center">
          <div className="pr-6">
            <div className="text-sm text-neutral-700">You currently have</div>
            <div className="text-xl">{userScore} points!</div>
          </div>
          <img
            src={displayedImage}
            alt="User"
            className="w-12 h-12 rounded-full"
          />
        </div>
      </button>
      {isSettingsMenuOpen && (
        <div className="text-neutral-600 absolute top-10 right-0 mt-8 w-52 bg-gray2 rounded-lg shadow-lg py-2">
          <Link
            to="/your-top-songs"
            className="block px-4 py-2 hover:bg-neutral-800 hover:text-green-500"
          >
            Your Top Songs
          </Link>
          <Link
            to="/ranking"
            className="block px-4 py-2 hover:bg-neutral-800 hover:text-green-500"
          >
            Ranking
          </Link>
          <Link
            to="/logout"
            className="block px-4 py-2 hover:bg-neutral-800 hover:text-green-500"
          >
            Log Out
          </Link>
        </div>
      )}
    </div>
  );
};

export default Settings;
