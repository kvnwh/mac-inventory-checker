# Mac Mini Refurb Check

Checks Apple's refurbished Mac mini page and sends an email when inventory appears.

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
EMAIL_TO=your.email@gmail.com
EMAIL_FROM=your.email@gmail.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_16_character_gmail_app_password
```

For Gmail, `SMTP_PASS` should be a Gmail App Password, not your regular Gmail password.

## Run

```bash
node --env-file=.env check.js
```

If Apple redirects the Mac mini refurb page back to the general refurbished Mac page, the script treats that as no inventory and does not send an email. If the page is available, it sends a notification to `EMAIL_TO`.

## Notes

`.env` and `node_modules/` are ignored by Git. Commit `package.json`, `package-lock.json`, `check.js`, `.gitignore`, and this README.

## GitHub Actions

The workflow in `.github/workflows/check-inventory.yml` runs once per hour and can also be started manually from GitHub.

Add these repository secrets in GitHub under Settings > Secrets and variables > Actions:

- `EMAIL_TO`: the address that should receive inventory alerts
- `EMAIL_FROM`: the Gmail address sending the alert
- `SMTP_USER`: the Gmail address sending the alert
- `SMTP_PASS`: your Gmail App Password

After the workflow is pushed to GitHub, open the Actions tab, select "Check Mac Mini Refurb Inventory", and use "Run workflow" to test it once manually.
