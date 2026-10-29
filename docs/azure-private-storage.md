# Azure private storage flip (after deploy)

App downloads now go through Next.js (`/api/files/*` for logged-in users, `/api/public-files/*` for marketing PDFs) using `AZURE_STORAGE_CONNECTION_STRING`. Direct `blob.core.windows.net` links are no longer used in the app.

**Do not flip containers until this code is deployed to production.** Otherwise downloads break for everyone.

## 1. Deploy and smoke-test (containers still public)

While Azure is still public, confirm the new routes work:

| Who | What to click | Expected |
|-----|----------------|----------|
| Anonymous | Home → annual report | PDF opens |
| Anonymous | Home → Newsletters → Fall/Spring 2025 | PDF opens |
| Anonymous | Services → catalog embed / download | PDF loads |
| Intern | Manage → Intern Handbook, To-Do List templates | Files open |
| Staff | Applicants → Resume link | Resume opens |
| Staff | Interns → View Resume | Resume opens |
| Staff | Presentations → download | File opens |
| Staff | Past Interns → mid-sem report (if present) | File opens |

Also confirm `AZURE_STORAGE_CONNECTION_STRING` is set in the production App Service / env.

## 2. Set containers to Private

Azure Portal → Storage account **`apcstorage`** → **Containers** → for each container below → **Change access level** → **Private (no anonymous access)**:

- `resumes`
- `presentations`
- `checklist-impactcalculator`
- `checklist-presentation`
- `staff-only-materials`
- `handbook`
- `intern-reports`
- `communication-timemangement`

CLI example (Azure CLI):

```bash
az storage container set-permission --account-name apcstorage --name resumes --public-access off
az storage container set-permission --account-name apcstorage --name presentations --public-access off
az storage container set-permission --account-name apcstorage --name checklist-impactcalculator --public-access off
az storage container set-permission --account-name apcstorage --name checklist-presentation --public-access off
az storage container set-permission --account-name apcstorage --name staff-only-materials --public-access off
az storage container set-permission --account-name apcstorage --name handbook --public-access off
az storage container set-permission --account-name apcstorage --name intern-reports --public-access off
az storage container set-permission --account-name apcstorage --name communication-timemangement --public-access off
```

(Use `--auth-mode login` or account key as your org requires.)

## 3. Verify lock-down

Anonymous direct Azure URL should fail (401 / not authorized):

```bash
curl -I "https://apcstorage.blob.core.windows.net/staff-only-materials/Intern-Handbook-Revision-13-01132025.docx"
```

Same file via the app (logged-in browser session) should still return 200:

`/api/files/staff-only-materials/Intern-Handbook-Revision-13-01132025.docx`

Public marketing should still work without login:

`/api/public-files/staff-only-materials/APC%20Professional%20Services%20Catalog%202026.pdf`

## 4. Re-run smoke-test

Repeat the table in step 1 after the Private flip. If anything 502s, check App Service logs and that the connection string still has account key / SAS with read permission.
