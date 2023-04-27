import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { employeeSchema } from "./models/user";
dotenv.config();

const mongoose = require('mongoose');

const path = require('path');
const cors = require('cors')

import {run} from './ldap';

const port = process.env.PORT || 4000;

dotenv.config();

const app: Express = express();
const apiRouter = express.Router();

//env variables
/* 
console.log(process.env.MONGODB_USER, process.env.MONGODB_PASSWORD process.env.MONGO_URL); //debugging 

const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD; 
*/

//use test credentials for now
const username = 'anna';
const password = 'holysmoke';
const react_dev_url = 'http://localhost:3000'

//middleware
app.use(express.json());
app.use(cors({origin: react_dev_url}));


// Mount the apiRouter as a middleware
app.use('/api', apiRouter);

// test
app.get('/', (req: Request, res: Response) => {
    res.send(`Hi from express typescript server, ${__dirname}`);   
});

app.post('/', (req, res )=>{
    res.header('Content-Type', 'application/json');
try {
     run(req.body.username, req.body.password)
      .then((user)=>console.log(user))
     
    }
    catch(err){console.log(res.errored?.message)}
})

//connect to mongoose
main();

async function main() {
    
    try{
  await mongoose.connect(`mongodb+srv://anna:holysmoke@exove.oc69cro.mongodb.net/?retryWrites=true&w=majority`, {useNewUrlParser:true, useUnifiedTopology: true});
  console.log('successfully connected to mongo atlas')
}catch(err){
    console.log(err)
}
}



const Employee = mongoose.model('Employee', employeeSchema);





app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});