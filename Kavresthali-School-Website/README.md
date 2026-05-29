# Kavresthali Secondary School — Website

A responsive, animated school website with multi-role portal login
(Student / Parent / Teacher / Admin).

## How to run

Just open `index.html` in any modern browser — no build step needed.

For best results (so fonts and icons load), serve the folder with a
tiny local server:

```bash
# Python 3
python -m http.server 8000

# Node
npx serve .
```

Then visit <http://localhost:8000>.

## Files

```
Kavresthali-School-Website/
├── index.html              ← page markup
├── assets/
│   ├── styles.css          ← all styling (neon-aurora theme)
│   ├── main.js             ← particles, cursor, login logic
│   └── principal.jpg       ← principal portrait
└── README.md
```

## External dependencies (loaded from CDN at runtime)

- **Google Fonts** — Playfair Display + Nunito
- **Boxicons** 2.1.4 — `https://unpkg.com/boxicons`
- **Typed.js** 2.0.15 — rotating hero word

These load over the internet; the site needs a connection on first visit.
To go fully offline, download these to `assets/` and update the `<link>` /
`<script>` tags in `index.html`.

## Customising

- **School name** — find `Kavresthali Secondary School` in `index.html` and replace
- **Colors** — see `:root { --cyan, --magenta, --gold ... }` at the top of `assets/styles.css`
- **Hero photo** — replace `assets/principal.jpg`
- **Login behaviour** — the form is a demo. To connect to a real backend, edit the
  `loginForm.addEventListener('submit', …)` block near the end of `assets/main.js`
  and POST credentials to your auth endpoint.

© 1985 – 2026 Kavresthali Secondary School.
