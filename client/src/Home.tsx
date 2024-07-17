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


    

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const spotifyUserResponse = await axios.get("https://api.spotify.com/v1/me", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        
                    },
                });
                const user = spotifyUserResponse.data;
                setUserData(user);

                // Fetch current score from your database
                const databaseServerResponse = await axios.post("http://localhost:2115/get-user-score", {
                    User_Id: user.id,
                });

                // Update score state with the fetched score
                setScore(databaseServerResponse.data.data.Score);
            } catch (error) {
                console.error("Error fetching user data or score: ", error);
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
                    Score: score,
                });
                console.log("Score updated on server:", databaseServerResponse.data);
            } catch (error) {
                console.error("Error updating score on server: ", error);
            }
        };

        if (userData && userData.id && score !== null) {
            updateScoreOnServer();
        }
    }, [userData, score]);

    const incrementScore = () => {
        if (score !== null) {
            setScore(score + 1);
        }
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
                    {userData && score !== null && (
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
        </div>
    );
};

export default Home;
