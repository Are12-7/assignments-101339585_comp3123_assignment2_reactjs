// Carlos Arellano - 101339585
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const employeesRoutes = require('./routes/employees.js');
const userRoutes = require('./routes/users.js');


const app = express();

const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use(express.urlencoded())

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to Database')).catch((error) => console.log(error.message));

/*
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('connected', () => console.log('Connected to Database'))*/

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//User route
app.use('/api/user', userRoutes);

//Employee route
app.use('/api/emp/employees', employeesRoutes);


app.route("/")
    .get((req, res) => {
        res.send("<h1>Assignment 2</h1>")
    })

app.listen(PORT, () => console.log(`Server Running on port: http://localhost:${PORT}`)); 