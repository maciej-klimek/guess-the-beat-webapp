require('dotenv').config();

const AWS = require('aws-sdk');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Konfiguracja AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const tableName = 'Users';
const item = {
    User_ID: req.body.User_ID,
    displayName: req.body.displayName,
    Score: 5,
}

const params = {
    TableName: tableName,
    Item: item,
};

const getParams = {
    TableName: tableName,
    Key: { User_ID: req.body.User_ID },
};

app.post("/store-user-data", async (req, res) => {
    const { User_ID, item } = req.body;

    console.log("User body", req.body);
    console.log("User_ID:", item.User_ID);

    // Pobierz aktualny Score użytkownika
    const getParams = {
        TableName: 'Users',
        Key: { User_ID: User_ID },
    };

    try {
        const data = await dynamoDB.get(getParams).promise();
        const currentScore = data.Item ? data.Item.Score : 0;

        // Zaktualizuj Score i displayName użytkownika
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

        const result = await dynamoDB.update(updateParams).promise();
        console.log("Update succeeded:", result.Attributes);
        res.json({
            message: 'User data updated successfully',
            data: result.Attributes,
        });

    } catch (error) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(error, null, 2));
        res.sendStatus(500);
    }
});

app.get('/get-item', (req, res) => {
    const { tableName, key } = req.query;

    const params = {
        TableName: 'Users',
        Key: JSON.parse(key),
    };

    dynamoDB.get(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.sendStatus(500);
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            res.json(data);
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
