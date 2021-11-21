const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findone({_id: context.user._id});
                return userData
            }
            throw new AuthenticationError(' Did not log in')
        }
    },

    Mutation: {
        addUser: async (parent, args) =>{
            const user = await User.create(args);
            const token = signToken(user);
            return {token, user};
        },

        saveBook: async(parent, {input}, context) => {
            if(context.user) {
                const updatedList = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: { savedBooks: input}},
                    {new: true}
                );
            }
            return updatedList
        },

        removeBook: async(parent, args, context) =>{
            if (context.user) {
                const updatedList = await User.findOneAndDelete(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId: args.bookId}}},
                    {new: true}
                );
                return updatedList;
            }
           throw new AuthenticationError('You need to log in to remove a book')
        },

        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if (!user){
                throw new AuthenticationError('User not found')
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Password is incorrect');
            }

            const token = signToken(user);
            return {token, user};
        }
    }
};

module.exports = resolvers;