import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='32' y1='6' x2='32' y2='60' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0%25' stop-color='%23E8D070'/%3E%3Cstop offset='100%25' stop-color='%238E6A18'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='32' cy='32' r='32' fill='%2307060C'/%3E%3Cline x1='32' y1='11' x2='13.5' y2='44' stroke='url(%23g)' stroke-width='1.5' stroke-linecap='round'/%3E%3Cline x1='32' y1='11' x2='50.5' y2='44' stroke='url(%23g)' stroke-width='1.5' stroke-linecap='round'/%3E%3Cline x1='13.5' y1='44' x2='50.5' y2='44' stroke='url(%23g)' stroke-width='1.5' stroke-linecap='round'/%3E%3Ccircle cx='32' cy='11' r='4' fill='url(%23g)'/%3E%3Ccircle cx='13.5' cy='44' r='4' fill='url(%23g)'/%3E%3Ccircle cx='50.5' cy='44' r='4' fill='url(%23g)'/%3E%3C/svg%3E"/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
