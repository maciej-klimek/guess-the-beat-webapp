require('dotenv').config();

const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

console.log(process.env.SPOTIFY_SECRET_KEY)

// Trasa logowania do Spotify
router.post("/login", (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:2115",
        clientId: "463204cdb0ad4f2384e3e037fa48f4d8",
        clientSecret: process.env.SPOTIFY_SECRET_KEY,
    });

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            });
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
});

// Trasa odświeżania tokenu
router.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        clientId: "463204cdb0ad4f2384e3e037fa48f4d8",
        clientSecret: process.env.SPOTIFY_SECRET_KEY,
        refreshToken: refreshToken,
    });

    spotifyApi
        .refreshAccessToken()
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in,
            });
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
});

module.exports = router;
