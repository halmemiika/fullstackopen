const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
} = require("apollo-server");

require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => console.log("error connecting to MongoDb:", err.message));

const typeDefs = gql`
  type Book {
    title: String!
    author: Author!
    published: String!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    bookCount: Int!
    born: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String!]
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.genre && args.author) {
        const author = await Author.findOne({ name: args.author });
        const books = await Book.find({
          genres: { $in: [args.genre] },
        }).populate("author");
        return books.filter((b) => b.author.name === author.name);
      }
      if (args.genre) {
        return await Book.find({
          genres: { $in: [args.genre] },
        }).populate("author");
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        return await Book.find({ author: { $in: [author] } }).populate(
          "author"
        );
      }
      return await Book.find({}).populate("author");
    },
    allAuthors: async () => {
      let authorData = [];
      const authors = await Author.find({});
      const books = await Book.find({}).populate("author");
      authors.forEach((author) => {
        const amountOfBooks = books.filter(
          (book) => book.author.name === author.name
        ).length;
        authorData.push({
          name: author.name,
          born: author.born,
          bookCount: amountOfBooks,
        });
      });
      return authorData;
    },
    me: (root, args, { currentUser }) => {
      return currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        const newAuthor = new Author({ name: args.author });

        try {
          await newAuthor.save();
          author = newAuthor;
        } catch (err) {
          throw new UserInputError(err.message, {
            invalidArgs: args,
          });
        }
      }

      const newBook = new Book({ ...args, author: author._id });

      try {
        await newBook.save();
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args,
        });
      }
      return newBook;
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) return null;

      const updatedAuthor = { ...author._doc, born: args.setBornTo };
      return await Author.findOneAndUpdate({ name: args.name }, updatedAuthor, {
        new: true,
      });
    },
    createUser: (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((err) => {
        throw new UserInputError(err.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "commonpassword") {
        throw new UserInputError("wrong credentials");
      }

      const userToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userToken, JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
