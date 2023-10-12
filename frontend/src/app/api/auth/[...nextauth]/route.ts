import NextAuth, { AuthOptions, getServerSession, Session } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import AzureAD from "next-auth/providers/azure-ad";

export type CustomSession = {
  id_token?: string,
  access_token?: string
} & Session

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          scope: "openid profile email api://7ef3a24e-7093-41dc-9163-9618415137fe/Vibes.ReadWrite"
        }
      },
      idToken: true,
    }),

  ],
  debug: true,
  // TO ENV
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, account }) {
      if (account) {
        token.id_token = account.id_token;
        token.access_token = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        session = Object.assign({}, session, {
          id_token: token.id_token,
          access_token: token.access_token,
        });
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export async function getCustomServerSession(authOptions: AuthOptions){
  return await getServerSession(authOptions) as CustomSession;
}

export { handler as GET, handler as POST };
