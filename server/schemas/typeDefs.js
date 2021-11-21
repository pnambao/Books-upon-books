const { gql } = require('apollo-server-express');

const typeDefs = gql`

type Book {
    authors: String
    description: String
    bookId: String
    image: String
    link: String
    title: String
}

type User {
    _id: String
    username: String
    email: String
    password: String
    savedBooks: [Book]
}

type Auth {
    token: String
    user: User
}

type Query {
    me: [User]
}

type Mutations {

login(email: String!, password: String!): Auth
addUser(username: String!, email: String!, password: String!): Auth
saveBook(authors: Array!, description: String!, title: String!, bookId: String!, image: String!, link: String!) User
removeBook(bookID: String!) User
}
`;

module.exports = typeDefs;