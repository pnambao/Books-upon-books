//ALL IMPORTS
        //const path = require('path');
        //const routes = require('./routes');
const express = require('express');
const db = require('./config/connection'); //connecting to mongodb


//  Importing the apollo server. 
const { ApolloServer } = require('apollo-server-express');

// Defining the location of the typedefs and resolvers, and importing them from the index of the schema file. 
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

// Creates a new instance of the apollo server that uses typeDefs and resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Updating express.js to use the apollo server. 
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.use(routes);

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });

db.once('open', () => { //opens up the mongo database
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});