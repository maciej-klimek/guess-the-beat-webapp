import { Link } from "react-router-dom";
import ByListeningPanel from "./selection_panels/ByListeningPanel";
import ByAlbumCoverPanel from "./selection_panels/ByAlbumCoverPanel";
import Settings from "./Settings";

interface HomeProps {
    accessToken: string | null;
}

const Home: React.FC<HomeProps> = ({ accessToken }) => {
    console.log(accessToken);

    return (
        <div className="relative h-screen text-green-500 text-center bg-gray1 poppins-semibold flex flex-col">
            <Settings/>
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
                </div>
            </div>
            <div className="text-sm break-words w-full text-stone-800 mt-4">
                AccessToken: {accessToken}
            </div>
        </div>
    );
};

export default Home;
