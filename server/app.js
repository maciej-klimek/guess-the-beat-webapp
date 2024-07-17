require('dotenv').config();


const express = require('express');
const authRoutes = require('./auth_server');
const dbRoutes = require('./db_server');

const app = express();
const path = require('path')
const _dirname = path.dirname("")

const buildPath = path.join(_dirname, "../client/dist");

app.use(express.static(buildPath))

app.get("/*", function (req, res) {

    res.sendFile(
        path.join(__dirname, "../client/dist/index.html"),
        function (err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    );

})


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

app.use(authRoutes);
app.use(dbRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
