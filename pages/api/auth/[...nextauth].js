import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import dbConnect from "../../../config/dbConnect";
import User from "../../../models/user";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credential) {
        dbConnect();
        const { email, password } = credential;

        if (!email && !password) {
          throw new Error("Please provide email and password");
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
          throw new Error("Invalid credentials");
        }

        return Promise.resolve(user);
      },
    }),
  ],
  callbacks: {
    jwt: async (token, user) => {
      user && (token.user = user);
      return Promise.resolve(token);
    },
    session: async (session, user) => {
      session.user = user.user;
      return Promise.resolve(session);
    },
  },
});
