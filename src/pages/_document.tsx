// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
     <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-questionset-editor-web-component/styles.css"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-questionset-editor-web-component/sunbird-questionset-editor.js"
          async
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
