# LifeFlow — Blood Donation Camp Website

A modern static website for GitHub Pages with:
- donor registration form matching your current Google Form questions
- Google Sheets storage through Google Apps Script
- protected aggregate analytics dashboard
- responsive mobile/desktop UI
- no Node.js or database server required

## Architecture

`GitHub Pages` → HTML/CSS/JS → `Google Apps Script Web App` → `Google Sheet`

GitHub Pages hosts the frontend. Apps Script receives the form POST and writes each registration to the Sheet.

## 1. Create the Google backend

1. Create/open a Google Sheet (optional; the script can create one automatically).
2. Open **Extensions → Apps Script**.
3. Replace the default code with `Code.gs`.
4. Change:
   `const ADMIN_KEY = "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET_KEY";`
   to a long random value only you know.
5. Save.
6. Run `setupSheet()` once from the Apps Script editor and authorize it.
7. Open **Deploy → New deployment**.
8. Select **Web app**.
9. Execute as **Me**.
10. Set access to **Anyone** so the public GitHub Pages form can submit.
11. Deploy and copy the Web App URL ending in `/exec`.

## 2. Connect GitHub Pages

Open `config.js` and replace:

`PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`

with your `/exec` URL.

Do not put your ADMIN_KEY in `config.js`. The dashboard asks for the key at runtime and keeps it in sessionStorage only.

## 3. Publish on GitHub Pages

Upload all files to a GitHub repository:
- `index.html`
- `dashboard.html`
- `styles.css`
- `config.js`
- `app.js`
- `dashboard.js`
- `Code.gs` (this file can remain in the repository, but it is not executed by GitHub Pages)
- `README.md`

In GitHub, open **Settings → Pages** and choose the branch/folder containing the site. GitHub Pages publishes static files from the repository.

## 4. Important security/privacy notes

The registration data includes personal information. Keep the Google Sheet private and share it only with authorized campaign staff.

The public website does not display individual donor records. The dashboard exposes aggregate counts only and requires the Apps Script admin key.

The admin key is a simple application-level gate, not a replacement for Google account authentication. For a production system containing sensitive donor data, use a stronger authenticated backend.

Do not collect medical history, passwords, Aadhaar numbers, PAN, or other sensitive information unless you have a clear lawful need and appropriate safeguards.

## 5. Form fields

The website mirrors the questions currently visible in the supplied Google Form, including:
- Full name
- Age group
- Gender
- Blood group
- Previous donation
- Donation frequency
- Last donation
- Willingness to donate
- Emergency contact preference
- Emergency difficulty
- How donors are found
- Directory usefulness
- Search method
- Emergency notifications
- Current availability
- Whether the database can reduce search time
- Additional feature
- Encouragement method
- Digital registry importance
- Additional thoughts

Your original Google Form remains separate. This website sends registrations directly to the Google Sheet through Apps Script.
