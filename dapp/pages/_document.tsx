import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#07060A" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <body className="bg-background text-gray-200 antialiased selection:bg-gold/20 selection:text-gold">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
