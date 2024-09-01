require('dotenv').config();
const AWS = require('aws-sdk');
const express = require('express');
const router = express.Router();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Endpoint to fetch user score
router.post("/get-user-score", (req, res) => {
    const { User_Id } = req.body;

    const params = {
        TableName: 'UsersTable',
        Key: { User_Id: User_Id }
    };

    dynamoDB.get(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.sendStatus(500);
        } else if (Object.keys(data).length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json({
                message: 'User score fetched successfully',
                data: data.Item,
            });
        }
    });
});
// Endpoint to fetch user score
router.get("/get-ranking", (req, res) => {
    const params = {
        TableName: 'UsersTable',
        ProjectionExpression: 'User_Id, DisplayName, Score',
        Limit: 10,
        ScanIndexForward: false,
        IndexName: 'ScoreIndex'
    };

    dynamoDB.scan(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.sendStatus(500);
        } else {
            res.json({
                message: 'Ranking fetched successfully',
                data: data.Items,
            });
        }
    });
});

// Endpoint to store user data
router.post("/store-user-data", (req, res) => {
    const { User_Id, DisplayName, Score } = req.body;

    // Check if user exists
    const checkParams = {
        TableName: 'UsersTable',
        Key: { User_Id: User_Id }
    };

    dynamoDB.get(checkParams, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.sendStatus(500);
        } else if (Object.keys(data).length === 0) {
            // User does not exist, add them
            console.log("User does not exist, adding them.");
            const addParams = {
                TableName: 'UsersTable',
                Item: { User_Id: User_Id, DisplayName: DisplayName, Score: 0 }
            };
            dynamoDB.put(addParams, (err, data) => {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    res.sendStatus(500);
                } else {
                    res.json({
                        message: 'User added successfully',
                        data: addParams.Item,
                    });
                }
            });
        } else {
            // User exists, update their data
            console.log("User exists");
            const updateParams = {
                TableName: 'UsersTable',
                Key: { User_Id: User_Id },
                UpdateExpression: 'set DisplayName = :d, Score = :s',
                ExpressionAttributeValues: {
                    ':d': DisplayName,
                    ':s': Score
                },
                ReturnValues: 'UPDATED_NEW',
            };

            dynamoDB.update(updateParams, (err, result) => {
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
        }
    });
});

module.exports = router;
