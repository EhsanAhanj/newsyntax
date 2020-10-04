const { User } = require("../model/User");
const { Message } = require("../model/Message");
const moment = require("moment");
//who can see new massage
let subscribers = [];
const onMessagesUpdates = (callback) => subscribers.push(callback);

// let messages = [];
module.exports.resolvers = {
  Query: {
    allMessages: async () => await Message.find(),
    message: async (_, { _id }) => await Message.findById(_id),
    uploads: () => db.get("uploads").value(),
  },
  Mutation: {
    createMessage: async (_, data, { user }) => {
      const { sender, sendTo, content } = data;

      const message = new Message({
        sender,
        sendTo,
        content,
        created_at: moment(Date.now()).format(
          "{YYYY} MM-DDTHH:mm:ss SSS [Z] A"
        ),
      });

      await message.save();
      //   await User.findByIdAndUpdate(sendTo, { $push: { inbox: message } });
      subscribers.forEach((callback) => callback());
      return message;
    },
    createUser: async (_, { username, email, password }) => {
      const hash = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hash,
        created_at: moment(Date.now()).format(
          "{YYYY} MM-DDTHH:mm:ss SSS [Z] A"
        ),
      });
      await newUser.save();

      return newUser;
    },
    singleUpload: (obj, { image }) => image,
    multipleUpload: (obj, { images }) => Promise.all(images.map(processUpload)),
    signInUser: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new UserInputError(
          "No user exists with that email address. Please try again"
        );
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new UserInputError("Incorrect password. Please try again.");
      }

      const token = jsonwebtoken.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3w" }
      );

      return token;
    },
  },
  Subscription: {
    inboxMessages: {
      subscribe: (_, args, { pubsub, user }) => {
        const channel = Math.random().toString(36).slice(2, 15);
        // const { inboxMessages } = await User.findById(user._id);
        const messages = Message.find();
        onMessagesUpdates(() =>
          pubsub.publish(channel, { inboxMessages: messages })
        );
        setTimeout(
          () => pubsub.publish(channel, { inboxMessages: messages }),
          0
        );
        return pubsub.asyncIterator(channel);
      },
    },
  },
};
