# Security Policy

## Supported Versions

Only the latest release on the `main` branch receives security fixes.

| Version | Supported |
|---------|-----------|
| `main` (latest) | ✅ |
| Older tags / forks | ❌ |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Report security issues by e-mail to:

📧 **luizfelipescaramuzza@gmail.com**

Include in your report:

- A clear description of the vulnerability
- Steps to reproduce (proof-of-concept if possible)
- Affected component (frontend, backend, database layer)
- Potential impact assessment

We aim to acknowledge reports within **48 hours** and provide a resolution timeline within **7 days** of confirmation.

## Scope

| In scope | Out of scope |
|---|---|
| Authentication / session handling | Issues in forked or modified copies |
| Row Level Security (RLS) bypass | Social engineering |
| SQL injection in backend routes | Denial-of-service via rate abuse |
| XSS in rendered content | Vulnerabilities in Supabase infrastructure itself |
| Exposed secrets / credentials in code | Theoretical vulnerabilities without proof |

## Known Dependency Alerts

The repository may show Dependabot alerts for transitive dependencies (e.g. `vite`, `esbuild`). These are actively monitored. If you believe any of them are exploitable in the context of this project, please report via the e-mail above.

## Disclosure Policy

We follow a **coordinated disclosure** model. Once a fix is released, we will publicly acknowledge the reporter (unless anonymity is requested) and describe the vulnerability in the release notes.

## Security Best Practices for Self-Hosters

If you are running Vekta on your own infrastructure:

- Never commit `.env` files containing real credentials
- Use a dedicated Supabase service role key with minimal permissions
- Enable Supabase Row Level Security (RLS) on all tables — the provided SQL migrations already do this
- Run the backend behind a reverse proxy (nginx, Caddy) with HTTPS
- Rotate the `JWT_SECRET` before deploying to production
