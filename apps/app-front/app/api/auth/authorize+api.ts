import {GOOGLE_AUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI} from "@/lib/constants"

export async function GET(request: Request){
    if(!GOOGLE_CLIENT_ID){
        return Response.json({error: "GOOGLE_CLIENT_ID is not set", status: 500})
    }

    const url = new URL(request.url);
    let idpClientId: string;
    const internalClient = url.searchParams.get("client_id");
    const redirectUri = url.searchParams.get("redirect_uri");

    if(internalClient === "google"){
        idpClientId = GOOGLE_CLIENT_ID;
    }else{
        return Response.json({error: "Invalid client", status: 500})
    }

    const state = "mobile|" + url.searchParams.get("state");

    const params = new URLSearchParams({
        client_id: idpClientId,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: url.searchParams.get("scope") || "identity",
        state: state,
        prompt: "select_account",
    });

    return Response.redirect(GOOGLE_AUTH_URL + "?" + params.toString());
}