import { NextApiRequest, NextApiResponse } from "next";
import { VibesSession, getVibesServerSession } from "./sessionTools";

export async function getInsightTokens(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // First try to get session from cookie
    const tokens = await getVibesServerSession(req, res);

    if (tokens) {
      return tokens;
    }

    // Else use check header-tokens
    return {
      azureToken: req.headers["idtoken"] as string,
      
    } as VibesSession;


  } catch (e: any) {
    throw new Error(
      "Token neither found in getServerSession or headers. Contact developers"
    );
  }
}
