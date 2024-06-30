// Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import ByListeningPanel from "./home_page_selection_panels/ByListeningPanel";
import ByAlbumCoverPanel from "./home_page_selection_panels/ByAlbumCoverPanel";

interface HomeProps {
    accessToken: string | null;
}

const Home: React.FC<HomeProps> = ({ accessToken }) => {
    console.log(accessToken);


    return (
        <div className="h-screen text-green-500 text-center bg-gray1 poppins-semibold">
            <h1 className="text-5xl pt-40">Guess the beat!</h1>
            <div>AccessToken: {accessToken}</div>
            <div className="flex justify-center w-screen mt-20">
                <div className="flex w-3/4 mt-20">
                    <div className="flex-1 mr-32">
                        <Link to="/guess-by-listening">
                            <ByListeningPanel />
                        </Link>
                    </div>
                    <div className="flex-1 ml-32">
                        <Link to="/guess-by-album-cover">
                            <ByAlbumCoverPanel />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
