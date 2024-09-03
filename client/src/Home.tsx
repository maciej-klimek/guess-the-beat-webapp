import { Link, useNavigate } from "react-router-dom";
import ByListeningPanel from "./selection_panels/ByListeningPanel";
import ByAlbumCoverPanel from "./selection_panels/ByAlbumCoverPanel";
import Settings from "./Settings";
import { useEffect, useState } from "react";
import ScoreManagement from "./UserDataManager"; // Import ScoreManagement

interface HomeProps {
    accessToken: string | null;
}

interface User {
    display_name: string;
    id: string;
    score: number | null;
    image: string | null;
}

const Home: React.FC<HomeProps> = ({ accessToken }) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [score, setScore] = useState<number | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const user = await ScoreManagement.fetchUserData(accessToken);
            if (user) {
                setUserData(user);
                setScore(user.score);
            }
        };

        if (accessToken) {
            fetchData();
        }
    }, [accessToken]);

    useEffect(() => {
        const updateData = async () => {
            if (userData && userData.id && score !== null) {
                await ScoreManagement.updateScoreOnServer(userData.id, userData.display_name, score);
            }
        };

        updateData();
    }, [userData, score]);

    const incrementScore = () => {
        if (score !== null) {
            setScore(score + 1);
        }
    };

    const goToRanking = () => {
        navigate("/ranking");
    };

    return (
        <div className="relative h-screen text-green-500 text-center bg-gray1 poppins-semibold flex flex-col">
            <Settings userImage={userData?.image} /> 
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
                            <p className="text-xl">Your score: {score}</p>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={incrementScore}
                            >
                                Increment Score
                            </button>
                            <button
                                className="mt-4 px-4 py-2 bg-green-500 text-white rounded ml-4"
                                onClick={goToRanking}
                            >
                                View Ranking
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default Home;
