import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import LdapAuth from "ldapauth-fork";
import { employeeSchema } from "./models/user";
import {
  getTemplates,
  addTemplate,
  getActiveTemplate,
} from "./controllers/template";
//import { getActiveTemplate } from "./controllers/templateController";
//import { getTests } from "./controllers/tests";
dotenv.config();
import { Test } from "./models/test";
import { Template, ISection } from "./models/template";
import { categoryRoute } from "./routes/categoryRoute.js";
import { templateRoute } from "./routes/templateRoute.js";
import { questionRoute } from "./routes/questionRoute.js";

const mongoose = require("mongoose");
const options = {
  url: "ldap://ldap.forumsys.com:389",
  bindDN: "cn=read-only-admin,dc=example,dc=com",
  bindCredentials: "password",
  searchBase: "dc=example,dc=com",
  searchFilter: "uid={{username}}",
  reconnect: true,
};

const cors = require("cors");
const bodyparser = require("body-parser");
const port = process.env.PORT || 4000;
const client = new LdapAuth(options);

const app: Express = express();
const apiRouter = express.Router();

const path = require("path");
/* apiRouter.use("/template", templateRoute);
apiRouter.use("/question", questionRoute);
apiRouter.use("/category", categoryRoute); */

//env variables
/* 
console.log(process.env.MONGODB_USER, process.env.MONGODB_PASSWORD process.env.MONGO_URL); //debugging 

const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD; 
*/

//mongo Atlas: use test credentials for now
const username = "anna";
const password = "holysmoke";
const react_dev_url = "http://localhost:3000";

//middleware
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use("/api", apiRouter);
connectMongoose().then(() => console.log("database ready"));

const test = new Test({ title: "third test" });
//test.save();

export interface ITemplate {
  templateTitle: string;
  sections: ISection[];
  active: boolean;
}

const body = new Template({
  templateTitle: "Summer 2020",
  sections: [],
  active: false,
});

// endpoint testing
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.get("/tests", async (req, res) => {
  const result = await Test.find();
  res.json({ tests: result });

  //res.send({ result: result });
});

app.get("/templates", (req, res) => {
  getTemplates().then((result) => res.send(result));
  //mongoose.connection.close();
});

app.get("/templates/active", (req, res) => {
  getActiveTemplate().then((result: any) => res.send(result));
});

app.post("/template", (req, res) => {
  connectMongoose().then(() => {
    res.send("database ready, attempting fetch");
    addTemplate(req.body);
  });
  mongoose.connection.close();
});

app.post("/testpost", (req, res) => {
  res.header("Content-Type", "application/json");
  console.log(req.body); //debugging : received server-side
  const credentials = req.body;
  if (credentials) {
    try {
      client.authenticate(
        credentials.username,
        credentials.password,
        (error, user) => {
          if (error) {
            return res.status(401).end("access denied");
          }
          console.log(user);
          res.send(`${user.ou}`);
        }
      );
    } catch {
      res.send("error encountered, access denied");
    }

    client.close();
  }
});

async function connectMongoose() {
  try {
    await mongoose.connect(
      `mongodb+srv://anna:holysmoke@exove.oc69cro.mongodb.net/exove_employees?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("successfully connected to mongo atlas");
  } catch (err) {
    console.log(err);
  }
}

// for testing
const ldapUsername: string = "newton";
const ldapPassword: string = "password";

const Employee = mongoose.model("Employee", employeeSchema);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

function getTests() {}
