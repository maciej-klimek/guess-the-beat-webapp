// Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import ByListeningPanel from "./home_page_selection_panels/ByListeningPanel";
import ByAlbumCoverPanel from "./home_page_selection_panels/ByAlbumCoverPanel";
import { useAuth } from "./Auth";

interface HomeProps {
    accessToken: string | null;
}

const Home: React.FC<HomeProps> = ({ accessToken }) => {
    console.log(accessToken);


    // fetchowanie, chcemy uzyskać daną piosenkę z playlisty
    //elementy potrzebne do złożenia fetcha
    const offset = 0; // numer piosenki na playliscie
    const playlistID = '37i9dQZF1DX49bSMRljsho'; // unikatowy identyfikator playlisty-

    // zapytanie fetch
    fetch('https://api.spotify.com/v1/playlists/' + playlistID + '/tracks?limit=1&offset=' + offset, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
        // Teraz ma byc obrabianie odpowiedzi tak zeby uzyskac tytul/wykonawce (nie ma tego ale ta logika tu moze byc)
        .then(response => response.json())
        .then(response => console.log(response))


    // ================================ Testowy fetch zwracający wszystkie piosenki z playlisty==================
    // fetch('https://api.spotify.com/v1/playlists/37i9dQZF1DX49bSMRljsho/tracks',{
    //   method: 'GET',
    //   headers: {
    //     'Authorization' : 'Bearer ' + token
    //   }
    // })
    //   .then(response => response.json())
    //   .then(data => console.log(data))
    //   .catch(error => console.error(error));
    // console.log('Chuj');
    // ========================================================================================================

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
