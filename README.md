# CompanyName — Complete Website Demo

A responsive, multi-page static website concept for a professional loan/debt
collection agency. Every page shares the same theme (dark navy + orange),
sticky header/mobile menu and footer, and scores 100/100/100 on
Accessibility, Best Practices and SEO (Lighthouse).

## Pages

| Page | Path |
| --- | --- |
| Home | `index.html` |
| About | `About/index.html` |
| Services | `Services/index.html` |
| Industries | `Industries/index.html` |
| Technology | `Technology/index.html` |
| Our Approach | `Approach/index.html` |
| Contact | `Contact/index.html` |

**Request a Quote** is not a separate page — it opens as a modal dialog that is
available from every page. All "Request a Quote" buttons (and other
call-to-action buttons) open this shared modal.

## Files

- `styles.css` — theme, layout, modal, responsive behavior, accessibility styles
- `script.js` — mobile navigation, current year, the Request-a-Quote modal, and
  the demo enquiry/quote form behavior

## Preview locally

Run a static server from this folder, for example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/` (or open `index.html` directly). Internet
access is needed for Google Fonts and the remote Unsplash photographs.

## Request a Quote modal

- Injected once by `script.js` and shared by every page, so the quote form is
  never duplicated in the HTML.
- Opens from any element with a `data-quote-open` attribute (the nav CTA and
  the various call-to-action buttons).
- Accessible: `role="dialog"` with `aria-modal`, a labelled title, focus moved
  into the dialog, focus trapped while open, `Esc` and backdrop/close-button
  dismissal, and focus returned to the trigger on close.
- Deep-linkable: visiting `.../index.html#quote` opens the modal on load.

## Forms

- The **Contact** form and the **Request a Quote** modal both validate locally
  and open the visitor's email app with a pre-filled draft. They do **not**
  send or store data on a server.
- No performance figures are presented as real results; the dashboard and
  charts are illustrative UI.

## Before publishing

1. Replace the demo contact placeholders (phone, email, address) in the
   header/footer of every page (or remove them).
2. Review all service descriptions and compliance language for your real
   business and applicable jurisdiction.
3. For real lead capture, connect a backend or form provider and configure
   the destination email.
4. Replace external images with licensed/owned assets if required.
5. Replace the illustrative testimonials on the About page with real,
   permissioned client quotes.

## GitHub Pages

Upload the repository. In Settings → Pages, choose the deployment branch and
the repository root. All internal links are relative, so subfolder hosting
works.
