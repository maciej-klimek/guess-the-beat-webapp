import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
interface RankingProps {
  accessToken: string;
}

interface UserScore {
  User_Id: string;
  DisplayName: string;
  Score: number;
}

const Ranking: React.FC<RankingProps> = ({ accessToken }) => {
  const [scores, setScores] = useState<UserScore[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get("http://localhost:2115/get-ranking");
        setScores(response.data.data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    if (accessToken) {
      fetchRanking();
    }
  }, [accessToken]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-green-500 bg-gray1 poppins-semibold p-4">
    <div className="absolute top-6 right-4">
        <Link to="/" className="text-white bg-gray2 p-2 rounded">
            Home
        </Link>
    </div>
    <h2 className="text-3xl mt-4">Ranking</h2>
    <table className="table-auto text-left mt-8 w-full max-w-2xl border-collapse">
        <thead>
            <tr>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">User Name</th>
                <th className="px-4 py-2">Score</th>
            </tr>
        </thead>
        <tbody>
            {scores.map((user, index) => (
                <tr key={user.User_Id} className={index % 2 === 0 ? "bg-gray" : "bg-gray2"}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.DisplayName}</td>
                    <td className="px-4 py-2">{user.Score}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
  );
};

export default Ranking;
