import { Auth, AUTH_STRATEGIES } from '@8base/auth';

const domain = 'secure.8base.com';
const clientId = 'W7ByJ3K7UBBAy6o2jXmdxVDF4ctRBIAL';

const logoutRedirectUri = `${window.location.origin}/logout`;
const redirectUri = `${window.location.origin}/auth/callback`;

export default Auth.createClient(
    {
        strategy: AUTH_STRATEGIES.WEB_8BASE,
        subscribable: true,
    },
    {
        domain,
        clientId,
        redirectUri,
        logoutRedirectUri,
    }
);