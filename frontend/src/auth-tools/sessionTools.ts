import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextApiRequest, NextApiResponse } from "next";
import { DefaultSession, Session, getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface VibesSession extends DefaultSession {
  azureToken: string;
  apiToken: string;

}

export function makeVibesSession(token: JWT, session: Session) {
  // Send properties to the client, like an access_token from a provider.
  // console.log({ token, session });
  const vibesSession: VibesSession = {
    ...session,
    apiToken: token.idToken as string,
    user: session.user,
    expires: session.expires,
    azureToken: token.idToken as string,
  };

  return vibesSession;
}

export async function getVibesServerSession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const vibesSession = (await getServerSession(
    req,
    res,
    authOptions
  )) as VibesSession;

  return vibesSession;
}
