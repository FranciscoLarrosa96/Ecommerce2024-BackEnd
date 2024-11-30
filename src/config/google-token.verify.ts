import { OAuth2Client } from "google-auth-library";
import { envs } from "./envs";


const client = new OAuth2Client(envs.GOOGLE_SECRET);

export async function googleVerify(token: string):Promise<any> {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: envs.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  return payload;
}
