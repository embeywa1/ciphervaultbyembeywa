A high-performance, client-side cryptographic security application designed to generate uncrackable credentials locally in the browser. Built to demonstrate zero-knowledge privacy standards, real-time bit-rate entropy calculations, and cryptographically secure pseudorandom number generation (CSPRNG) via native browser APIs.

---

## ⚡ Key Technical Features & Security Model

- **Zero-Network Exposure (Client-Side Isolation):** All credential generation and entropy calculations occur strictly within the client browser runtime. Zero data is transmitted across network sockets or external endpoints.
- **Native Web Crypto API CSPRNG:** Replaces predictable pseudo-random algorithms (`Math.random()`) with hardware-level entropy using `window.crypto.getRandomValues()`.
- **Live Bit-Rate Entropy Engine:** Calculates password entropy dynamically in real time using Shannon entropy mathematics ($E = L \times \log_2(R)$), providing visual feedback on brute-force resilience.
- **Interactive Precision Controls:** Granular character-set toggles (Uppercase, Lowercase, Numeric, High-Entropy Symbols, Excluded Ambiguous Characters) with dual-range length sliders (8 to 128 characters).
- **Zero-Trace Clipboard Memory:** One-click secure copy utility with automated client-side memory purge timers to prevent clipboard scraping attacks.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React.js
- **Styling & UI Components:** Tailwind CSS (Cyber-Dark Theme `#090D16`), Lucide React Icons
- **Cryptographic Engine:** Browser Native Web Crypto API
- **Deployment Platform:** Lovable / Vercel Edge Runtime

---

## 🔬 Cryptographic Implementation Detail

CIPHERVAULT uses unbiased byte sampling over the native Web Crypto interface to eliminate modulo bias during character mapping:

```javascript
/**
 * Generates cryptographically secure random integers avoiding modulo bias.
 * @param {number} max - Upper bound for character set index.
 * @returns {number} Unbiased random index.
 */
function getSecureRandomIndex(max) {
  const array = new Uint32Array(1);
  const maxUnbiased = Math.floor(0xffffffff / max) * max;
  let randomVal;

  do {
    window.crypto.getRandomValues(array);
    randomVal = array[0];
  } while (randomVal >= maxUnbiased);

  return randomVal % max;
}
```
🚀 Local Development Setup
Prerequisites
Ensure you have the following installed on your machine:

Node.js (v18.0.0 or higher)

npm or pnpm

1. Clone the Repository

Bash
git clone [https://github.com/embeywa1/ciphervaultbyembeywa.git](https://github.com/embeywa1/ciphervaultbyembeywa.git)
cd ciphervaultbyembeywa

2. Install Dependencies
Bash
npm install


3. Start Development Server
   
Bash
npm run dev
Open http://localhost:5173 in your browser to launch the utility locally.

📂 Project Structure
Plaintext
ciphervault/
├── src/
│   ├── components/      # Cyber-Dark terminal controls, sliders, and entropy meters
│   ├── lib/             # Web Crypto CSPRNG & Shannon entropy calculator engines
│   ├── hooks/           # Custom clipboard auto-purge & theme state hooks
│   ├── App.jsx          # Main application architecture
│   └── index.css        # Tailwind custom layer rules & terminal glow effects
├── public/              # Static security icons & manifests
├── package.json         # Dependencies and build scripts
└── README.md            # Technical documentation
