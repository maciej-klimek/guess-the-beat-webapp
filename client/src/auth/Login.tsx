const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=463204cdb0ad4f2384e3e037fa48f4d8&response_type=code&redirect_uri=http://localhost:5173&scope=user-top-read%20user-library-read%20user-read-private";

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray1 poppins-semibold">
      <div className="max-w-xl w-full bg-gray2 p-16 rounded-lg shadow-lg">
        <h1 className="text-5xl mb-8 text-center text-green-500">
          Guess the Beat
        </h1>
        <h1 className="text-5xl mb-8 text-center">
        🔥 🔥 🔥         
        </h1>

        <p className="text-center mb-8 text-neutral-700">
          Please log in to continue
        </p>
        <a
          href={AUTH_URL}
          className="block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-center poppins-semibold"
        >
          Login with Spotify
        </a>
      </div>
    </div>
  );
};

export default Login;
