const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const redis = require("redis");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config()

const mainRouter = require("./src/router/mainRouter");
const authRouter = require("./src/router/authRouter");
const dashRouter = require("./src/router/dashRouter");
const responseTime = require("response-time");

const app = express()
const PORT = process.env.PORT || 4001;

const client = redis.createClient();

client.connect();

app.use(session({secret: 'sekret_key', resave: true, saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(responseTime());


app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

client.on('error', err => {
    console.log(`ERROR: ${err}`);
})

app.get('/', (req, res) => {
    res.render('index')
})
app.get('/api/search', async (req, res) => {
    const query = req.query.title.trim();

    const searchURL = `http://localhost:4001/${query}`;

    const redisResult = await client.get(`imdb:${query}`, (err, result) => {
        if (result) {
            return result;
        }
        if (err) {
            console.log(err);
        }
    })

    if (redisResult) {
        return res.status(200).json(JSON.parse(redisResult));
    } else {
        return axios.get(searchURL)
        .then(response => {
            const resJSON = response.data;
            client.setEx(`imdb:${query}`, 3600, JSON.stringify({source: "Redis CACHE", ...resJSON}));

            return res.status(200).json({source: "IMDB API", resJSON});
        })
        .catch(err => {
            return res.json(400).json(err);
        });
    }
})


app.post('/send', (req, res) => {
    const {name, company, email, phone, message} = req.body
    try {
        const config = {
            service: 'gmail',
            auth: {
                user: 'rahmatillaxikam00@gmail.com',
                pass: 'fkgx uxvv fuza nlna'
            }
        }

        let transpoter = nodemailer.createTransport(config)

        const output = `
        <h3>Contact Details<h3/>
        <ul>
        <li>Name: ${name}</li>
        <li>Company: ${company}</li>
        <li>Email: ${email}</li>
        <li>Phone: ${phone}</li>
        <li>Message: ${message}</li>
        </ul>
        `

        const msg = {
            to: ["muhammadbilol1011@gmail.com", "rahmatillaxikmatillayev2@gmail.com"],
            from: 'rahmatillaxikam00@gmail.com',
            subject: 'Contact Request via Nodemailer',
            text: 'Mail is sent by Sendgrid App',
            html: output,
        }

        transpoter.sendMail(msg) 
        console.log('msg send');
        res.render('status')
    } catch (error) {
        console.log(error);
    }
})



app.use('/', mainRouter);
app.use('/', authRouter);
app.use('/', dashRouter);


const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}

start();
