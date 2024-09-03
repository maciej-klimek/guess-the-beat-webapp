import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        <div>
            <h1>Ranking</h1>
            <ul>
                {scores.map((user, index) => (
                    <li key={index}>
                        {user.DisplayName}: {user.Score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Ranking;