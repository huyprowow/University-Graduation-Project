import mongodbConnect from "@/lib/mongodbConnect";
import User from "@/models/User";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const options: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      profile(profile) {
        return {
          id: profile.sub,
          ...profile,
          role: profile.email === process.env.ADMIN_EMAIL ? "admin" : "user",
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile }: any) {
      try {
        // Optional: Add custom logic for handling the user after sign-in
        if (account.provider === "google") {
          await mongodbConnect();
          const { email, name, picture, given_name, family_name } = profile;
          // Database logic (replace with your actual logic)
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            // User already exists, return the existing user
            return existingUser;
          } else {
            // Create a new user
            const newUser = new User({
              email,
              name,
              avatar: picture,
              firstName: given_name,
              lastName: family_name,
              isAdmin: email === process.env.ADMIN_EMAIL ? true : false,
            });
            await newUser.save();

            return newUser;
          }
        }
        return true;
      } catch (error) {
        console.log(error);

        return false;
      }
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }: any) {
      session.user.role = token.role;
      return session;
    },
   
  },
  secret: process.env.NEXTAUTH_SECRET, // Add a secret for better security
};
const handler = NextAuth(options);

export { handler as GET, handler as POST };
