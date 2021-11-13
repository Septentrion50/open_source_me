require("dotenv").config();
import { ApolloServer, } from "apollo-server";
import {typeDefs} from './typeDefs';
import {resolvers} from './resolvers';

const PORT = process.env.PORT || 4000;


const myPlugin = {
    // Fires whenever a GraphQL request is received from a client.
    async requestDidStart(requestContext:any) {
      console.log('Request started! Query:\n' +
        requestContext.request.query);
  
      return {
        // Fires whenever Apollo Server will parse a GraphQL
        // request to create its associated document AST.
        async parsingDidStart(requestContext:any) {
          console.log('Parsing started!');
        },
  
        // Fires whenever Apollo Server will validate a
        // request's document AST against your GraphQL schema.
        async validationDidStart(requestContext:any) {
          console.log('Validation started!');
        },
  
      }
    },
  };
  
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins:[myPlugin]
});

server.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
  return;
});
