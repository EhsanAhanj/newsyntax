const { GraphQLServer, PubSub } = require("graphql-yoga");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const mongoose = require("mongoose");
const { typeDefs } = require("./graphql/typeDefs");
const { resolvers } = require("./graphql/resolvers");
const { upload } = require("./middleware/uploadHandler");

const PORT = process.env.PORT || 5000;
const WS_PORT = process.env.WS_PORT || 5050;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/chatyoga";
const MONGO_DB = process.env.MONGO_DB || "chatyoga";
const JWT_SECRET = process.env.JWT_SECRET || "superdupersecret";

require("dotenv").config();

mongoose
  .connect(MONGO_URL, {
    promiseLibrary: Promise,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.error(err.stack))
  .then((client) => {
    console.log("Connect to MongoDB");
  });
const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

server.express.use(express.static(path.join(__dirname, "./uploads")));
server.express.use(bodyParser.json());
server.express.use(cors());
server.express.use(upload.array("images"));

server.start(({ port }) =>
  console.log("server start on http://localhost:" + port)
);
