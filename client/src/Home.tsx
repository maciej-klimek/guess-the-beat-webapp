import { Link } from "react-router-dom";
import ByListeningPanel from "./selection_panels/ByListeningPanel";
import ByAlbumCoverPanel from "./selection_panels/ByAlbumCoverPanel";
import Settings from "./Settings";
import { useEffect, useState } from "react";
import axios from "axios";

interface HomeProps {
    accessToken: string | null;
}

interface User {
    display_name: string;
    id: string;
}

const Home: React.FC<HomeProps> = ({ accessToken }) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [incrementedScore, setIncrementedScore] = useState<number>(0); // State to manage the incremented score

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const spotifyUserResponse = await axios.get("https://api.spotify.com/v1/me", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setUserData(spotifyUserResponse.data);
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        if (accessToken) {
            fetchUserData();
        }
    }, [accessToken]);

    useEffect(() => {
        const updateScoreOnServer = async () => {
            try {
                const databaseServerResponse = await axios.post("http://localhost:2115/store-user-data", {
                    User_Id: userData?.id,
                    DisplayName: userData?.display_name,
                    Score: incrementedScore,
                });
                setScore(databaseServerResponse.data.data.Score); // Update score state with the updated score from the server response
            } catch (error) {
                console.error("Error updating score on server: ", error);
            }
        };

        if (userData && userData.id && incrementedScore !== 0) {
            updateScoreOnServer();
        }
    }, [userData, incrementedScore]);

    const incrementScore = () => {
        setIncrementedScore(incrementedScore + 1);
    };

    return (
        <div className="relative h-screen text-green-500 text-center bg-gray1 poppins-semibold flex flex-col">
            <Settings />
            <div className="flex-grow flex items-center justify-center">
                <div>
                    <h1 className="text-5xl">Guess the beat!</h1>
                    <div className="flex justify-center w-screen">
                        <div className="flex w-3/4 mt-20 max-w-5xl mx-auto">
                            <div className="flex-1 mr-16">
                                <Link to="/guess-by-listening">
                                    <ByListeningPanel />
                                </Link>
                            </div>
                            <div className="flex-1 ml-16">
                                <Link to="/guess-by-album-cover">
                                    <ByAlbumCoverPanel />
                                </Link>
                            </div>
                        </div>
                    </div>
                    {userData && (
                        <div className="mt-20">
                            <h2 className="text-2xl">Welcome, {userData.display_name}</h2>
                            <p className="text-xl">Your score: {score}</p> {/* Display current score */}
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={incrementScore}
                            >
                                Increment Score
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="text-sm break-words w-full text-gray-600 mt-4">
                AccessToken: {accessToken}
            </div>
        </div>
    );
};

export default Home;
