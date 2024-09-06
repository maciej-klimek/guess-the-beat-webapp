import { Link, useNavigate } from "react-router-dom";
import ByListeningPanel from "./selection_panels/ByListeningPanel";
import ByAlbumCoverPanel from "./selection_panels/ByAlbumCoverPanel";
import Settings from "./Settings";
import { useEffect, useState } from "react";
import UserDataManager from "./UserDataManager"; // Import ScoreManagement

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

  const handleRankingClick = () => {
    navigate("/ranking");
  }

  useEffect(() => {
    const fetchData = async () => {
      const user = await UserDataManager.fetchUserData(accessToken);
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
        await UserDataManager.updateUserScore(
          userData.id,
          userData.display_name,
          score
        );
      }
    };

    updateData();
  }, [userData, score]);
  console.log(score);
  return (
    <div className="relative h-screen text-green-500 text-center bg-gray1 poppins-semibold flex flex-col">
      <Settings userScore={score} userImage={userData?.image} />
      <div className="flex-grow flex items-center justify-center">
        <div>
          <h1 className="text-5xl">Guess the beat!</h1>
          <div className="flex justify-center w-screen">
            <div className="flex w-3/4 mt-20 max-w-5xl mx-auto">
              <div className="flex-1 mr-20">
                <Link to="/guess-by-listening">
                  <ByListeningPanel />
                </Link>
              </div>
              <div>
            <h1>Welcome to the Game</h1>
            <button onClick={handleRankingClick}>View Ranking</button>
        </div>
              <div className="flex-1 ml-20">
                <Link to="/guess-by-album-cover">
                  <ByAlbumCoverPanel />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
