import "./login.css";

const BASE_AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=463204cdb0ad4f2384e3e037fa48f4d8&response_type=code&redirect_uri=http://localhost:5173";

const SCOPES = ["user-top-read", "user-library-read", "user-read-private"];

const AUTH_URL = `${BASE_AUTH_URL}&scope=${SCOPES.join("%20")}`;

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray1 poppins-semibold bg-gradient">
      <div className="max-w-2xl w-full bg-gray2 p-16 rounded-lg shadow-lg text-center">
        <h1 className="text-6xl mb-8 text-green-500">Guess the Beat</h1>
        <h1 className="text-5xl mb-8">🔥 🔥 🔥</h1>

        <p className="text-neutral-700 mb-8">Please log in to continue</p>

        <div className="flex justify-center">
          <a
            href={AUTH_URL}
            className="w-1/2 text-lg bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-105"
          >
            Login with Spotify
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
