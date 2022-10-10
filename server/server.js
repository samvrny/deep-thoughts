const express = require('express');
const { authMiddleware } = require('./utils/auth');

//import ApolloServer
const { ApolloServer } = require('apollo-server-express');

//import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;

//create a new Apollo server and pass in our schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware 
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //integrate our Apollo server with teh Express application as middleware
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
}

//Call to the async function to start the server
startApolloServer(typeDefs, resolvers);
