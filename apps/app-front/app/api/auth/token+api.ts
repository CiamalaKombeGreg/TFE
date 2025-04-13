import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, JWT_EXPIRATION_TIME, JWT_SECRET } from "@/lib/constants";
import * as jose from 'jose';

export async function POST(request: Request){
    const body = await request.formData();
    const code = body.get("code") as string;

    if(!code){
        return Response.json({ error: "Missing auth code", status : 400})
    }

    if(!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET){
        return Response.json({ error : "Missing googles ID or secret", status : 500})
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
      code: code,
    }),
  });

    const data = await response.json();

    if(!data.id_token){
        return Response.json({ error : "ID token wasn't received", status : 400})
    }

    const userInfo = jose.decodeJwt(data.id_token) as object;

    const { exp,...userInfoWithoutExp} = userInfo as any;

    // User ID
    const sub = (userInfo as { sub: string}).sub;

    // Current timestamp in seconds
    const issuedAt = Math.floor(Date.now() / 1000);

    // Create access token (short-lived)
    const accessToken = await new jose.SignJWT(userInfoWithoutExp)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(JWT_EXPIRATION_TIME)
    .setSubject(sub)
    .setIssuedAt(issuedAt)
    .sign(new TextEncoder().encode(JWT_SECRET));

    return Response.json({access_token : accessToken})

}