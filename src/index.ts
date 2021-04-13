import express from "express";
import {ApolloServer} from "apollo-server-express";
import cors from "cors";
import schema from "./graphql/api";
import config from "./config";

const app = express();

const port = config.port();

import routerInstance from "./middleware";

app.use("*", cors());

const server = new ApolloServer({schema, playground: true});
server.applyMiddleware({app, path: "/graphql"});


app.use("/", routerInstance(express.Router()));

app.listen({port}, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});

