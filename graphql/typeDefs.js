const gql = require("graphql-tag");

module.exports.typeDefs = gql`
  scalar Upload

  type Message {
    _id: ID!
    sender: ID!
    sendTo: ID!
    content: String!
    image: String
    created_at: String
  }
  type User {
    _id: ID!
    username: String
    email: String
    inbox: [Message]
    created_at: String
  }
  type SignInPayload {
    token: String!
    user: User
  }
  type AuthProvider {
    email: String!
    password: String!
  }
  type File {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type Query {
    allUsers: [User]
    user: User
    allMessages: [Message]
    message: Message
    inboxMessages: [Message]
    uploads: [File]
  }
  type Mutation {
    createMessage(sender: ID!, sendTo: ID!, content: String): Message!
    singleUpload(file: Upload!): File!
    multipleUpload(files: [Upload!]!): [File!]!
    createUser(username: String!, email: String, password: String): User!
    signInUser(email: String!, password: String!): String
  }
  type Subscription {
    inboxMessages: [Message!]
  }
`;
