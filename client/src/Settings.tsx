import { useState } from "react";
import { Link } from "react-router-dom";

interface SettingsProps {
    userImage: string | null; // Add a prop to accept user image
}

const Settings: React.FC<SettingsProps> = ({ userImage }) => {
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

    const toggleSettingsMenu = () => {
        setIsSettingsMenuOpen(!isSettingsMenuOpen);
    };

    return (
        <div className="absolute top-8 right-8">
            <button
                onClick={toggleSettingsMenu}
            >
            {userImage && (
                <div className="flex items-center">
                    <img
                        src={userImage}
                        alt="User"
                        className="w-12 h-12 rounded-full"
                    />
                </div>
            )}
            </button>
            {isSettingsMenuOpen && (
                <div className="absolute top-10 right-0 mt-4 w-48 bg-gray2 rounded-lg shadow-lg py-2">
                    <Link to="/your-top-songs" className="block px-4 py-2 text-green-500 hover:bg-neutral-800">
                        Your Top Songs
                    </Link>
                    <Link to="/logout" className="block px-4 py-2 text-green-500 hover:bg-neutral-800">
                        Log Out
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Settings;
