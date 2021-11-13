require("dotenv").config();
import { ApolloServer } from "apollo-server-express";
import { Octokit } from "octokit";
import express from "express";
import cors from "cors";
import {typeDefs} from './typeDefs';
import {resolvers} from './resolvers';

const app = express();
const PORT = process.env.PORT || 4000;


const server = new ApolloServer({
  typeDefs,
  resolvers,
});
app.use(cors());
app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
  return;
});
