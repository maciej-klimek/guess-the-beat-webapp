import axios from "axios";

interface User {
  display_name: string;
  id: string;
  score: number | null;
  image: string | null;
}

interface UserDataManager {
  fetchUserData: (accessToken: string | null) => Promise<User | null>;
  updateUserScore: (
    userId: string,
    displayName: string,
    score: number | null
  ) => Promise<void>;
}

const UserDataManager: UserDataManager = {
  fetchUserData: async (accessToken) => {
    if (!accessToken) {
      console.error("Access token is null or undefined");
      return null;
    }

    try {
      // Fetch user data from Spotify
      const spotifyUserResponse = await axios.get(
        "https://api.spotify.com/v1/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const user = spotifyUserResponse.data;

      // Fetch user score from your database server
      const databaseServerResponseScore = await axios.post(
        "http://localhost:2115/get-user-data",
        {
          User_Id: user.id,
        }
      );

      const score = databaseServerResponseScore.data.data.Score;

      const image =
        user.images && user.images.length > 0 ? user.images[0].url : null;

      return {
        display_name: user.display_name,
        id: user.id,
        score,
        image,
      };
    } catch (error) {
      console.error("Error fetching user data or score: ", error);
      return null;
    }
  },

  updateUserScore: async (userId, displayName, score) => {
    if (!userId || score === null) {
      console.error("User ID or score is invalid");
      return;
    }

    try {
      const databaseServerResponse = await axios.post(
        "http://localhost:2115/store-user-data",
        {
          User_Id: userId,
          DisplayName: displayName,
          Score: score,
        }
      );
      console.log("Score updated on server:", databaseServerResponse.data);
    } catch (error) {
      console.error("Error updating score on server: ", error);
    }
  },
};

export default UserDataManager;
