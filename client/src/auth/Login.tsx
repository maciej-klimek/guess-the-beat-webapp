const AUTH_URL =
    "https://accounts.spotify.com/authorize?client_id=463204cdb0ad4f2384e3e037fa48f4d8&response_type=code&redirect_uri=http://localhost:5173&scope=user-top-read";

export default function Login() {
    return (
        <div className="flex justify-center items-center h-screen">
            <a
                href={AUTH_URL}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-block"
            >
                Login
            </a>
        </div>
    );
}
