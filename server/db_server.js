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

router.post("/get-user-data", (req, res) => {
    const { User_Id } = req.body;

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
            // User nie istnieje, dodaj go
            console.log("User does not exist, adding them.");
            const addParams = {
                TableName: 'UsersTable',
                Item: { User_Id: User_Id, Score: 0}
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
            res.json({
                message: 'User data fetched successfully',
                data: data.Item,
            });
        }
    });
});

router.post("/store-user-data", (req, res) => {
    const { User_Id, DisplayName, Score } = req.body;

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
});


router.get("/get-ranking", (req, res) => {
    const params = {
        TableName: 'UsersTable',
        ProjectionExpression: 'User_Id, DisplayName, Score',
    };

    dynamoDB.scan(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.sendStatus(500);
        } else {
            const sortedData = data.Items.sort((a, b) => b.Score - a.Score).slice(0, 10);

            res.json({
                message: 'Ranking fetched successfully',
                data: sortedData,
            });
        }
    });
});

module.exports = router;
