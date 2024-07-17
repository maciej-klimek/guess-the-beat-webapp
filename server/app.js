require('dotenv').config();


const express = require('express');
const authRoutes = require('./auth_server');
const dbRoutes = require('./db_server');

const app = express();

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
