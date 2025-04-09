import {APP_SCHEME} from "@/lib/constants";

export async function GET(request: Request){
    const incomingParams = new URLSearchParams(request.url.split('?')[1]);
    const combinedPlatformAndState = incomingParams.get('state')

    if(!combinedPlatformAndState){
        return Response.json({error: "Invalid state", status: 400})
    }

    const state = combinedPlatformAndState.split('|')[1];

    const outgoingParams = new URLSearchParams({
        code: incomingParams.get('code')?.toString() || "",
        state,
    });

    return Response.redirect(APP_SCHEME + "?" + outgoingParams.toString());
}