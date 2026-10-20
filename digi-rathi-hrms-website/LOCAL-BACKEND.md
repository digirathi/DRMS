# SQLite mode

The primary installation uses Supabase. The standalone SQLite adapter remains for offline development and isolated tests. Select the backend explicitly through your private configuration; do not switch providers expecting data to synchronize automatically.

Run the Node server, open the local setup page when no accounts exist, and create your own Super Admin. No sample employees or transactions are inserted. Accounts use hashed passwords, HttpOnly sessions and CSRF checks. Initial temporary credentials require a password change; your own login ID/password can be changed in Settings after current-password verification. Preserve `data/` privately and never commit it.

Cloud-only modules, private images and the hosted notification queue require the Supabase configuration described in SUPABASE-IMPLEMENTATION.md. Missing services report errors rather than inventing saved records.
