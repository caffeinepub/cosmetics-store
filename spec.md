# Specification

## Summary
**Goal:** Fix the persistent "Unauthorized" error when calling `updateSiteSettings` by correcting backend authorization logic and ensuring the frontend uses the authenticated actor.

**Planned changes:**
- Capture the deployer's principal at canister install/init time and store it as the initial admin in stable state in `backend/main.mo`
- Rewrite the authorization check for `updateSiteSettings` (and other admin-protected methods) to compare the runtime caller against the stored admin list using `Principal.equal`
- Update the `updateSiteSettings` mutation in `useQueries.ts` to always use the authenticated actor when the user is logged in
- If the user is not authenticated, reject the mutation early and show a toast: "Please log in to save settings"
- If the backend returns an Unauthorized error, display the existing descriptive error toast

**User-visible outcome:** An authenticated admin user can successfully save site settings without receiving an "Access denied" error. Unauthenticated users see a clear "Please log in to save settings" message instead of a failed backend call.
