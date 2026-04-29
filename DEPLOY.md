# Deploying the site to GoDaddy

This repository contains a minimal static site for JSO Solutions. Below are quick deployment options so you can get `jsotechsolutions.com` live fast.

## 1) Manual upload via cPanel File Manager (fast)
- Log into GoDaddy, go to Web Hosting → Manage → cPanel Admin → File Manager.
- Open the site's document root (commonly `/public_html` or the folder for `jsotechsolutions.com`).
- Upload the site files (you can upload a zip and extract in File Manager).

## 2) FTP/SFTP (use an FTP client like FileZilla)
- Use host, username, and password from your GoDaddy hosting panel and upload the repo files to the document root.
- Example with `lftp` to mirror the local folder to `/public_html`:
```bash
lftp -u 'USERNAME,PASSWORD' ftp.your-host.com <<'EOF'
mirror -R ./ /public_html
quit
EOF
```

## 3) Automated deploy with GitHub Actions (recommended for repo-driven workflow)

- A sample workflow was added at `.github/workflows/deploy.yml` that runs on pushes to `main` and deploys using FTP.
- To enable it:
  1. Create a GitHub repo and push this site (commands below).
  2. In GitHub, go to Settings → Secrets & variables → Actions and add the following repository secrets:
     - `FTP_HOST` — your FTP server host (e.g., `ftp.your-host.com`)
     - `FTP_USERNAME`
     - `FTP_PASSWORD`
     - `FTP_TARGET` — the remote folder (e.g., `/public_html`)
  3. Push to the `main` branch; the workflow will run and deploy automatically.

Local commands to push to GitHub:
```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/jso-site.git
git push -u origin main
```

## Notes
- If GoDaddy's Managed WordPress is what you have, they also support repo-based deploys via GitHub Actions — check your hosting product first.
- As a fallback, GitHub Pages is a quick temporary option; I can add instructions for that if you'd like.
- For HTTPS: GoDaddy hosting often includes SSL; otherwise you can install a certificate via cPanel. GitHub Pages supplies HTTPS automatically for mapped domains.

## Next steps I can take for you
- Walk you through creating the GitHub repo and adding the secrets.
- Walk you through the first manual FTP upload to confirm the site is live.
- Apply branding (replace `assets/images/JSOSolutions1.jpg` and color variables in `assets/css/style.css`) if you upload the invoice or logo image here.
