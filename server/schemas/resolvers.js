const {Book, User} = require('../models');

const resolvers = {
    Query: {
        me: async () => {
            return await User.findbyId(args.id).populate('savedBooks')
        }
    },

    Mutation: {
        addUser: async (parent, {username, email, password}) =>{
            return await User.create({username, email, password});
        },

        saveBook: async() => {

        },

        removeBook: async() =>{

        },

        login: async () => {

        }

    }
}

module.exports = resolvers;