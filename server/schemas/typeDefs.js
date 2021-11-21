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
    books: [Book]
    users: [User]
}

type Mutations {


}
`;

module.exports = typeDefs;