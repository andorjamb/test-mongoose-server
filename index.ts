import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import LdapAuth from 'ldapauth-fork';
import { employeeSchema } from "./models/user";
dotenv.config();

const mongoose = require('mongoose');
const options = {
    'url': 'ldap://ldap.forumsys.com:389',
    'bindDN': 'cn=read-only-admin,dc=example,dc=com',
    'bindCredentials': 'password',
    'searchBase': 'dc=example,dc=com',
    'searchFilter': 'uid={{username}}',
    'reconnect':true
};

const cors = require('cors')
const bodyparser = require('body-parser');
const port = process.env.PORT || 4000;
const client = new LdapAuth(options);

const app: Express = express();
const apiRouter = express.Router();

type welcomeText = {
    cn:string,
    email: string
}

//env variables
/* 
console.log(process.env.MONGODB_USER, process.env.MONGODB_PASSWORD process.env.MONGO_URL); //debugging 

const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD; 
*/

//mongo Atlas: use test credentials for now
const username = 'anna';
const password = 'holysmoke';
const react_dev_url = 'http://localhost:3000'

//middleware
app.use(express.json());
app.use(cors({
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use('/api', apiRouter);

// endpoint testing
app.get('/', (req: Request, res: Response) => {
    res.send(`Hi from express typescript server`);   
});

app.get('/test', (req: Request, res: Response) => {
    res.send(`Hi from test page`);   
});

app.post('/testpost', (req, res ) => {
res.header('Content-Type', 'application/json'); 
console.log(req.body);//debugging : received server-side
const credentials = req.body;
if (credentials) {

try {
    client.authenticate(credentials.userName, credentials.password, (error, user) => {
        if (error) {
            return res.status(401)
            .end('access denied');
        }
        console.log(user);
        res.send(`post request received with params:${req.body.userName}, returning ${user.cn}`)
        })
    }  catch{
        res.send('error encountered, access denied')
    }

    client.close()
}
})



async function connectMongoose() {    
    try {
  await mongoose.connect(`mongodb+srv://anna:holysmoke@exove.oc69cro.mongodb.net/?retryWrites=true&w=majority`, {useNewUrlParser:true, useUnifiedTopology: true});
  console.log('successfully connected to mongo atlas')
}catch(err){
    console.log(err)
}
}

// for testing 
const ldapUsername:string = 'galieleo';
const ldapPassword:string = 'password'; 

const Employee = mongoose.model('Employee', employeeSchema);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});