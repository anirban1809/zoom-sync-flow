// src/lib/cognito.ts
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

const REGION = import.meta.env.VITE_AWS_REGION as string;
const APP_CLIENT_ID = import.meta.env.VITE_COG_APP_CLIENT_ID as string;

const cip = new CognitoIdentityProviderClient({ region: REGION });

export async function signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string
) {
    const response = await fetch("https://stagingapi.luminote.ai/auth/signup", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
        }),
    });

    const result = await response.json();

    if (!result.ok) {
        return {
            kind: "ERROR",
            error: result.error,
            message: "Failed to sign up",
        };
    }
    return result;
}

export async function resendCode(email: string) {
    const response = await fetch(
        "https://stagingapi.luminote.ai/auth/resend-code",
        {
            method: "POST",
            body: JSON.stringify({
                email,
            }),
        }
    );

    const result = await response.json();

    if (!result.ok) {
        return {
            kind: "ERROR",
            error: result.error,
        };
    }
    return result;
}

export async function cogConfirmSignUp(
    workspaceName: string,
    email: string,
    code: string,
    firstName: string,
    lastName: string
) {
    const response = await fetch("https://stagingapi.luminote.ai/auth/verify", {
        method: "POST",
        body: JSON.stringify({
            workspaceName,
            email,
            code,
            firstName,
            lastName,
        }),
    });

    const result = await response.json();

    if (!result.ok) {
        return {
            kind: "ERROR",
            error: result.error,
        };
    }
    return result;
}

// Hosted UI redirect helper (optional social buttons)
export function hostedUiRedirect(provider?: string) {
    const domain = import.meta.env.VITE_COG_HOSTED_DOMAIN as string; // e.g. my-domain.auth.us-east-1.amazoncognito.com
    const clientId = APP_CLIENT_ID;
    const redirectUri = encodeURIComponent(
        import.meta.env.VITE_COG_REDIRECT_URI as string
    );
    const base = `https://${domain}/oauth2/authorize`;
    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        scope: "openid email profile",
        redirect_uri: redirectUri,
    });
    if (provider) params.set("identity_provider", provider); // e.g., "Google", "SignInWithApple", "AzureAD", "Slack"
    window.location.href = `${base}?${params.toString()}`;
}

export async function forgotPassword(usernameOrEmail: string) {
    const response = await fetch(
        "https://stagingapi.luminote.ai/auth/forgot-password",
        {
            method: "POST",
            body: JSON.stringify({
                usernameOrEmail,
            }),
        }
    );

    if (!response.ok) {
        console.log(response.json());
        return {
            kind: "ERROR",
            message: "Failed to generate password reset code",
        };
    }
    return response.json();
}

export async function cogConfirmForgotPassword(
    usernameOrEmail: string,
    code: string,
    newPassword: string
) {
    const response = await fetch(
        "https://stagingapi.luminote.ai/auth/reset-password",
        {
            method: "POST",
            body: JSON.stringify({
                usernameOrEmail,
                code,
                newPassword,
            }),
        }
    );

    const result = await response.json();

    if (!result.ok) {
        return {
            kind: "ERROR",
            error: result.error,
        };
    }
    return result;
}
