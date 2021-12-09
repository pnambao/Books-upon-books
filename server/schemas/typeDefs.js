const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String!
    bookCount: Int
    savedBooks: [Book]!
  }

  type Book {
    bookId: String!
    authors: [String]!
    description: String
    image: String
    link: String
    title: String
  }
  # want to be able to add book and update book list so we need an input
  input savedBookInput {
    bookId: String!
    authors: [String]
    description: String!
    image: String
    link: String
    title: String!
  }

  # Set up an Auth type to handle returning data from a profile creating or user login
  type Auth {
    token: ID!
    user: User
  }
  type Query {
    me: User
  }

  type Mutation {
    # Set up mutations to handle creating a profile or logging into a profile and return Auth type
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    #setup mutations to add book to savedbooks arr and one to remove from arr
    addBook(input: savedBookInput!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
