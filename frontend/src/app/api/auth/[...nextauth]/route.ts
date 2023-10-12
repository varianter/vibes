import { makeVibesSession } from "@/auth-tools/sessionTools";
import NextAuth, { AuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      // authorization: { params: { scope: "openid email" } },
      // authorization: { params: { scope: "openid profile email Vibes.ReadWrite" } },
      // api://7ef3a24e-7093-41dc-9163-9618415@137fe/Vibes.ReadWrite"
      idToken: true,
    }),
  ],
  debug: true,

  callbacks: {
    async session({ session, token }) {
      return makeVibesSession(token, session);
    },
    async jwt({ token, account }) {
      // IMPORTANT: Persist the access_token to the token right after sign in
      if (account) {
        console.log({ account });
        token.idToken = account.id_token;
      }

      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
