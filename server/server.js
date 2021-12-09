const express = require("express");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");
const db = require("./config/connection");
// const routes = require('./routes');  ==not needed with graphql
const { typeDefs, resolvers } = require("./schemas");
// Import `authMiddleware()` function to be configured with the Apollo Server
const {authMiddleware} = require('./utils/auth');



const PORT = process.env.PORT || 3001;
const app = express();
//start new instance of apolloserver
const server = new ApolloServer({
  introspection: false,
  typeDefs,
  resolvers,
  // Add context to our server so data from the `authMiddleware()` function can pass data to our resolver functions
  context: authMiddleware,
});

//apply the middleware to express app
server.applyMiddleware({ app });
// express middlware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// app.use(routes); ==not needed with apollo & graphgl

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
     // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🌍 Now listening on localhost:${PORT}`);
  });
});
