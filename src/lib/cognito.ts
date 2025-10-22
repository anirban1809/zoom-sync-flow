// src/lib/cognito.ts
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const REGION = import.meta.env.VITE_AWS_REGION as string;
const APP_CLIENT_ID = import.meta.env.VITE_COG_APP_CLIENT_ID as string;

const cip = new CognitoIdentityProviderClient({ region: REGION });

export async function cogSignUp(
  email: string,
  password: string,
  attrs: Record<string, string> = {}
) {
  const UserAttributes = [
    { Name: "email", Value: email },
    ...Object.entries(attrs).map(([Name, Value]) => ({ Name, Value })),
  ];
  return cip.send(
    new SignUpCommand({
      ClientId: APP_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes,
    })
  );
}

export async function cogConfirmSignUp(email: string, code: string) {
  return cip.send(
    new ConfirmSignUpCommand({
      ClientId: APP_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    })
  );
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
