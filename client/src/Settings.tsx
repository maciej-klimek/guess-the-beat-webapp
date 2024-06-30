import { useState } from "react";
import { Link } from "react-router-dom";


const Settings = () => {

    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

    const toggleSettingsMenu = () => {
        setIsSettingsMenuOpen(!isSettingsMenuOpen);
    };
    return <div className="absolute top-4 right-4">
        <button
            className="text-white bg-gray2 p-2 rounded"
            onClick={toggleSettingsMenu}
        >
            Settings
        </button>
        {isSettingsMenuOpen && (
            <div className="absolute top-10 right-0 mt-2 w-48 bg-gray2 rounded-lg shadow-lg py-2">
                <Link to="/your-top-songs" className="block px-4 py-2 text-green-500 hover:bg-neutral-800">
                    Your Top Songs
                </Link>
                <Link to="/logout" className="block px-4 py-2 text-green-500 hover:bg-neutral-800">
                    Log Out
                </Link>
            </div>
        )}
    </div>
};

export default Settings;
