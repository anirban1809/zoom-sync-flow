// src/lib/cognito-auth.ts
import {
    CognitoIdentityProviderClient,
    GlobalSignOutCommand,
    RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const REGION = import.meta.env.VITE_AWS_REGION as string;
const APP_CLIENT_ID = import.meta.env.VITE_COG_APP_CLIENT_ID as string;
const DOMAIN = import.meta.env.VITE_COG_HOSTED_DOMAIN as string; // e.g. my-domain.auth.us-east-1.amazoncognito.com
const REDIRECT = encodeURIComponent(
    import.meta.env.VITE_COG_REDIRECT_URI as string
);

const cip = new CognitoIdentityProviderClient({ region: REGION });

// Store tokens in memory (preferred for SPAs)
let accessToken: string | null = null;
let idToken: string | null = null;
let refreshToken: string | null = null;

export type SignInResult = {
    kind?: string;
    message?: string;
    accessToken?: string;
    idToken?: string | null;
    refreshToken?: string | null;
};

export async function signIn(
    emailOrUsername: string,
    password: string
): Promise<SignInResult> {
    const response = await fetch("https://stagingapi.luminote.ai/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email: emailOrUsername,
            password: password,
        }),
    });

    if (!response.ok) {
        console.log(response.json());
        return { kind: "ERROR", message: "Incorrect username or password" };
    }
    return response.json();
}

export async function answerMfa(
    session: string,
    code: string,
    which: "SMS_MFA" | "SOFTWARE_TOKEN_MFA"
) {
    const r = await cip.send(
        new RespondToAuthChallengeCommand({
            ClientId: APP_CLIENT_ID,
            Session: session,
            ChallengeName: which,
            ChallengeResponses: {
                SMS_MFA_CODE: code,
                SOFTWARE_TOKEN_MFA_CODE: code,
                USERNAME: "",
            }, // USERNAME not required for USER_PASSWORD_AUTH
        })
    );
    if (r.ChallengeName === "NEW_PASSWORD_REQUIRED") {
        return { kind: "NEW_PASSWORD_REQUIRED", session: r.Session! } as const;
    }
    const auth = r.AuthenticationResult!;
    accessToken = auth.AccessToken ?? null;
    idToken = auth.IdToken ?? null;
    refreshToken = auth.RefreshToken ?? null;
    return {
        kind: "OK",
        accessToken: accessToken!,
        idToken,
        refreshToken,
    } as const;
}

export async function setNewPassword(session: string, newPassword: string) {
    const r = await cip.send(
        new RespondToAuthChallengeCommand({
            ClientId: APP_CLIENT_ID,
            Session: session,
            ChallengeName: "NEW_PASSWORD_REQUIRED",
            ChallengeResponses: { NEW_PASSWORD: newPassword, USERNAME: "" },
        })
    );
    const auth = r.AuthenticationResult!;
    accessToken = auth.AccessToken ?? null;
    idToken = auth.IdToken ?? null;
    refreshToken = auth.RefreshToken ?? null;
    return {
        kind: "OK",
        accessToken: accessToken!,
        idToken,
        refreshToken,
    } as const;
}

export async function signOutGlobally() {
    if (accessToken)
        await cip.send(new GlobalSignOutCommand({ AccessToken: accessToken }));
    accessToken = idToken = refreshToken = null;
}

export function getAccessToken() {
    return accessToken;
}
export function getIdToken() {
    return idToken;
}
export function getRefreshToken() {
    return refreshToken;
}

export function hostedUiRedirect(identityProvider?: string) {
    const base = `https://${DOMAIN}/oauth2/authorize`;
    const params = new URLSearchParams({
        client_id: APP_CLIENT_ID,
        response_type: "code",
        scope: "openid email profile",
        redirect_uri: REDIRECT,
    });
    if (identityProvider) params.set("identity_provider", identityProvider); // exact IdP name in Cognito
    window.location.href = `${base}?${params.toString()}`;
}
