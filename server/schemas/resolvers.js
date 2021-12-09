const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('book');
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Invalid Credentials");
      }
      const correctPass = await user.isCorrectPassword(password);

      if (!correctPass) {
        throw new AuthenticationError("Invalid Credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    // use context to that we know which user profile to save the book data to

    addBook: async (parent, { input }, context) => {
      // check to see if there is a user logged in
      // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
      
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input} },
          {
            new: true,
            runValidators: true,
          },
        );
      }
      // If user attempts to execute this mutation and isn't logged in, throw an error
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, {bookId}, context)=>{
      // Make it so a logged in user can only remove a book from their own profile  
      if(context.user){
          return User.findOneAndUpdate(
              {_id: context.user._id},
              {$pull: {savedBooks: {bookId: bookId}}},
              {new: true},
          )
      }
      throw new AuthenticationError('You need to be logged in!');
    }
  },
};



module.exports = resolvers;
