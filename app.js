const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const appRoute = require('./routes/route');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/users', appRoute);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "User Balance API",
            version:  "1.0.0",
            description: "A simple API for checking user balance and amoutn transfer between users"
        },
        servers: [
            {
                url: "http://localhost:8000"
            }
        ]
    },
    apis: ['./routes/*.js']
}

const specs = swaggerJsDoc(options)

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

app.get('/',(req,res)=>{
    res.send('this works');
});

mongoose.connect('mongodb://localhost:27017/local',()=>
    console.log('connected to DB!')
);

app.listen(8000);