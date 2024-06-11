import { azureAdProvider, refreshAccessTokenError } from "@/utils/auth";
import NextAuth, { AuthOptions, getServerSession, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import AzureADProvider from "next-auth/providers/azure-ad";

export type CustomSession = {
  id_token?: string;
  access_token?: string;
} & Session;

function getAzureADProvider() {
  return AzureADProvider({
    id: azureAdProvider,
    clientId: process.env.AZURE_AD_CLIENT_ID!,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
    tenantId: process.env.AZURE_AD_TENANT_ID!,
    httpOptions: {
      timeout: 20000,
    },
    authorization: {
      params: {
        scope: `openid profile email offline_access ${process.env.AZURE_AD_APP_SCOPE}`,
      },
    },
    idToken: true,
  });
}

function fromSecondsToMilliseconds(seconds: number) {
  return seconds * 1000;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const azureAdProvider = getAzureADProvider();

    const body = new URLSearchParams({
      client_id: azureAdProvider.options?.clientId!,
      scope: `openid profile email offline_access ${process.env.AZURE_AD_APP_SCOPE}`,
      refresh_token: (token as any).refresh_token!,
      grant_type: "refresh_token",
      client_secret: azureAdProvider.options?.clientSecret!,
    });

    const response = await fetch(
      `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token?`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body,
      },
    );

    const newTokens = await response.json();

    if (!response.ok) {
      throw newTokens;
    }

    return {
      ...token,
      access_token: newTokens.access_token,
      access_token_expires:
        Date.now() + fromSecondsToMilliseconds(newTokens.expires_in),
      refresh_token: newTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error(error);

    return {
      ...token,
      error: refreshAccessTokenError,
    };
  }
}

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [getAzureADProvider()],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, account }) {
      if (account) {
        token.id_token = account.id_token;
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.access_token_expires = account.expires_at
          ? fromSecondsToMilliseconds(account.expires_at)
          : 0;
      }

      if (
        token.access_token_expires &&
        Date.now() < (token.access_token_expires as number)
      ) {
        return token;
      }
      return refreshAccessToken(token);
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

export async function getCustomServerSession(authOptions: AuthOptions) {
  return (await getServerSession(authOptions)) as CustomSession;
}

export { handler as GET, handler as POST };
