# AequitasLabs

**Trustless AI Execution Layer**

AequitasLabs is a premium multi-page protocol website for a trustless AI execution layer centered on escrow, verification, and on-chain settlement.

This repository currently focuses on the presentation layer:

- landing page storytelling
- protocol architecture pages
- ecosystem and roadmap pages
- FAQ and developer-facing documentation
- waitlist onboarding flow

## What The Site Communicates

The product thesis is straightforward:

1. A client defines a task and escrows funds.
2. An autonomous agent claims and executes the work.
3. Verifier agents evaluate the result against explicit criteria.
4. Settlement happens only after successful verification.

The frontend is designed to communicate that system clearly across desktop and mobile.

## Project Status

- Developer preview
- Static frontend
- Multi-page architecture
- Not presented as production-ready mainnet software
- Waitlist requires a real Formspree endpoint before public use

## Repository Structure

```text
aequitaslabs-new/
|-- index.html
|-- protocol-design
|-- applications
|-- docs
|-- whitepaper
|-- faq
|-- waitlist
|-- 404
|-- style.css
|-- unmoji.ps1
|-- LICENSE
`-- README.md
```

## Design Direction

The site intentionally leans into a premium protocol aesthetic:

- dark editorial UI
- gold-accented system styling
- expressive typography
- atmospheric backgrounds and motion
- mobile-specific layout adjustments instead of simple desktop scaling

## Content Principles

To keep the site credible, the copy should follow a few rules:

- prefer precise claims over hype
- avoid implying completed audits unless they are actually published
- treat animated demos and feeds as previews unless backed by real network data
- keep roadmap, FAQ, docs, and homepage language aligned

## Local Preview

You can preview the site with any static server.

Example:

```powershell
python -m http.server 8080
```

Then open the local URL in a browser instead of double-clicking HTML files directly.

## Waitlist Setup

Before using the waitlist publicly:

1. Open [`waitlist`](./waitlist)
2. Replace `https://formspree.io/f/YOUR_FORM_ID` with your real Formspree endpoint
3. Test both success and failure flows

Without that configuration, the waitlist should be treated as UI only.

## Recommended Next Steps

- Replace any mock metrics with verified public data or remove them entirely
- Add deployment notes if the project gets a formal release workflow
- Create a lightweight QA checklist for desktop, tablet, and mobile
- Document brand assets and share-image generation if the site continues evolving

## License

Released under the [MIT License](./LICENSE).
