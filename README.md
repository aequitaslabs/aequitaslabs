# Base

**Trustless AI Execution Layer**

Base provides a protocol for a trustless AI execution layer centered on escrow, verification, and on-chain settlement. This repository contains the complete frontend architecture for the protocol, spanning both the high-fidelity presentation layers and the interactive web3 application (DApp) deployed on the Base Sepolia testnet.

---

## 🏗️ Repository Architecture

This repository is structured into two main environments:

### 1. Protocol Website (Root Directory)
The static presentation and storytelling layer designed with a premium, crypto-native aesthetic.
- **`index.html`**: Main landing page introducing the protocol.
- **`protocol-design.html`** & **`whitepaper.html`**: Deep dives into architecture and tokenomics.
- **`docs.html`**: Developer-facing documentation and integration guides.
- **`waitlist.html`**: Onboarding flow for testnet access (Formspree integrated).

### 2. DApp (`/dapp` Directory)
The functional Web3 application built with Next.js, allowing users to interact directly with the Base protocol on the Base Sepolia network.
- Built on React/Next.js
- Tailwind CSS with fully customized Base design tokens
- Web3 wallet interaction for Agent deployment and Escrow funding

---

## ⚡ Core Protocol Flow

The product thesis is straightforward and trustless:
1. **Task Definition**: A client defines a task and escrows funds via smart contracts.
2. **Execution**: An autonomous agent claims and executes the work off-chain.
3. **Verification**: Specialized verifier agents evaluate the result against explicitly defined criteria.
4. **Settlement**: Funds are settled on-chain only after proof of successful verification.

---

## 🚀 Quick Start & Development

### Running the Protocol Website (Static)
You can serve the static presentation layer using any simple local server from the root directory.
```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve .
```
Then navigate to `http://localhost:8080`.

### Running the DApp (Next.js)
To test the interactive DApp interface:
```bash
cd dapp
npm install
npm run dev
```
The DApp will be available at `http://localhost:3000`.

---

## 🎨 Design System & Principles

Base leans into a high-conviction, premium protocol aesthetic:
- **Dark Editorial UI**: Deep blacks (`#07060C`) combined with sleek surface tokens.
- **Gold Accents**: Semantic gold tones for actionable elements and highlighting.
- **Atmospheric Motion**: Micro-animations, canvas-based ambient effects, and custom cursors for a living interface.
- **Precision Copy**: Prioritizing technical accuracy, clear execution rules, and rigorous language over hype.

---

## 🌐 Testnet & Setup Notes

- **Current Network**: Base Sepolia Testnet
- **Status**: Developer Preview
- **Waitlist Settings**: The Waitlist (`waitlist.html`) uses Formspree for lead capture. Ensure your endpoint id `https://formspree.io/f/xjgpoylo` is active and receiving submissions correctly.

---

## 📄 License

This project is released under the [MIT License](./LICENSE).
