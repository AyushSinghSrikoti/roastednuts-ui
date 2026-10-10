# Distributed Systems Playground Plan

## Product direction

- [x] Keep the application as an internal, admin-only tool.
- [x] Use Google sign-in to identify users.
- [x] Authorize access on the backend using an approved-admin allowlist.
- [x] Use a dark operations-console visual theme:
  - slate/near-black backgrounds;
  - indigo and blue primary actions and system-status accents;
  - emerald success, amber warning, and red error states;
  - clean, dense dashboard cards, tables, metrics, and logs.

## Authentication and access control

- [ ] Decide whether the existing master-password sign-in remains as an emergency fallback after Google sign-in is available.
- [ ] Add Google OAuth credentials and configure development and production callback URLs.
- [ ] Add the required environment variables without committing their secret values.
- [ ] Add a Google sign-in button to the login page.
- [ ] Implement the Google OAuth redirect and callback flow.
- [ ] Verify the Google identity token on the Nest backend; do not trust a browser-provided email alone.
- [ ] Store approved admin email addresses in an `ADMIN_EMAILS` environment variable initially.
- [ ] Reject signed-in Google users whose verified email is not in the admin allowlist.
- [ ] Issue the application's own authenticated session/JWT with the `admin` role.
- [ ] Add backend authentication and authorization guards to protected API endpoints.
- [ ] Send the app token with authenticated frontend API requests.
- [ ] Protect dashboard routes and redirect unauthenticated users to `/login`.
- [ ] Add logout and expired-session handling.

## Frontend experience

- [ ] Define shared theme tokens for colour, typography, spacing, borders, and shadows.
- [ ] Create reusable dashboard primitives: page header, navigation, cards, status badges, tables, and empty/loading/error states.
- [ ] Restyle the login screen using the dark operations-console theme.
- [ ] Build the dashboard shell and navigation.
- [ ] Build the initial dashboard overview.
- [ ] Build the rate-limiter page.
- [ ] Show the signed-in admin identity and an access-denied screen where appropriate.

## Verification and deployment

- [ ] Test a successful approved-admin sign-in.
- [ ] Test sign-in by a Google account that is not on the allowlist.
- [ ] Test cancelled/failed Google sign-in.
- [ ] Test expired tokens and logout.
- [ ] Test direct visits to protected frontend routes and API endpoints.
- [ ] Document local and production environment setup and Google OAuth configuration.
