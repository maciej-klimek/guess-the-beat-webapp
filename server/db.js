require('dotenv').config();
import { DynamoDB } from 'aws-sdk';

const AWS = require('aws-sdk');
const express = require('express');
const router = express.Router();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const dynamoDB = new DynamoDB.DocumentClient();

router.post("/store-user-data", (req, res) => {
    const { User_ID, displayName } = req.body;
    console.log("User body", req.body);
    console.log("User_ID: ", User_ID);

    const getParams = {
        TableName: 'Users',
        Key: { User_ID: User_ID },
    };

    dynamoDB.get(getParams, (err, data) => {
        if (err) {
            console.error("Unable to get item. Error JSON:", JSON.stringify(err, null, 2));
            res.sendStatus(500);
        } else {
            const currentScore = data.Item ? data.Item.Score : 0;
            const updateParams = {
                TableName: 'Users',
                Key: { User_ID: User_ID },
                UpdateExpression: 'set displayName = :d, Score = :s',
                ExpressionAttributeValues: {
                    ':d': displayName,
                    ':s': currentScore + 1,
                },
                ReturnValues: 'UPDATED_NEW',
            };

            dynamoDB.update(updateParams, (err, result) => {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                    res.sendStatus(500);
                } else {
                    console.log("Update succeeded:", result.Attributes);
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
