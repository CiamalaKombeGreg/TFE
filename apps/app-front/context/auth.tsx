import * as React from 'react';
import {
    AuthError,
    AuthRequestConfig,
    DiscoveryDocument,
    exchangeCodeAsync,
    makeRedirectUri,
    useAuthRequest
} from "expo-auth-session"
import {BASE_URL} from "@/lib/constants";

export type AuthUser = {
    id: string;
    email: string;
    name: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    email_verified?: boolean;
    provider?: string;
    exp?: number;
    cookieExpiration?: number; // Added for web cookie expiration tracking

}

const AuthContext = React.createContext({
    user: null as AuthUser | null,
    signIn: () => {},
    signOut: () => {},
    fetchWithAuth: async (url: string, options?: RequestInit) => Promise.resolve(new Response()),
    isLoading: false,
    error: null as AuthError | null,
})

const config: AuthRequestConfig = {
    clientId: 'google',
    scopes: ["openid", "profile", "email"],
    redirectUri: makeRedirectUri()
};

const discovery: DiscoveryDocument = {
    authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
    tokenEndpoint: `${BASE_URL}/api/auth/token`
};

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const [user, setUser] = React.useState<AuthUser | null>(null); // Keeping track of the user
    const [error, setError] = React.useState<AuthError | null>(null); // Keeping track of any error
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [accessToken, setAccessToken] = React.useState<string>();

    const [request, response, promptAsync] = useAuthRequest(config, discovery)

    React.useEffect(() => {
        handleResponse()
            .then(r => console.log("Handling success", r))
            .finally(() => console.log("Handling finished"));
    }, [Response]);

    const handleResponse = async () => {
        if(response?.type === "success"){
            const { code } = response.params;

            try{
                setIsLoading(true);

                const tokenResponse = await exchangeCodeAsync({
                        code: code,
                        clientId: 'google',
                        redirectUri: makeRedirectUri(),
                    },
                    discovery
                );

                const accessToken = tokenResponse.accessToken;

                setAccessToken(accessToken);

            }catch(e){
                console.log(e);
            }finally{
                setIsLoading(false);
            }

            console.log(code)
        }else if(response?.type === "error"){
            setError(response.error as AuthError);
        }
    }

    const signIn = async () => {
        try{
            if(!request){
                console.log("No request");
                return;
            }

            await promptAsync();
        }catch(e){
            console.log(e)
        }
    };

    const signOut = async () => {};

    const fetchWithAuth = async (url: string, options?: RequestInit) => {};

    return <AuthContext.Provider value={
        {
            user,
            signIn,
            signOut,
            fetchWithAuth,
            isLoading,
            error,
        }
    }>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}