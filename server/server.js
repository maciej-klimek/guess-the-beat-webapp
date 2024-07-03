//zeby odpalic: npm run devStart
require('dotenv').config()

const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION // or your preferred region
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

require('dotenv').config()

const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/login", (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:5173",
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

app.post("/store-user-data", (req, res) => {
    const { User_ID, displayName } = req.body;
    console.log("User body", req.body);
    console.log("User_ID: ", User_ID);
    const params = {
        TableName: 'Users',
        Key: { User_ID: User_ID, Score: 0 },
        UpdateExpression: 'set displayName = :d',
        ExpressionAttributeValues: {
            ':d': displayName,
        },
        ReturnValues: 'UPDATED_NEW',
    };

    dynamoDB.update(params, (err, result) => {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            res.sendStatus(500);
        } else {
            res.json({
                message: 'User data updated successfully',
                data: result.Attributes,
            });
        }
    });
});

app.post("/refresh", (req, res) => {
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

app.listen(process.env.PORT);
