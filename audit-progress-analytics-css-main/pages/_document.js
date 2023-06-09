import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { SheetsRegistry, JssProvider, createGenerateId } from 'react-jss'


class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link href="/img/favicon.ico" rel="shortcut icon" type="image/x-icon"/>
         
        </Head>
        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    );
  }

  static async getInitialProps(ctx) {
    const registry = new SheetsRegistry()
    const generateId = createGenerateId()
    const originalRenderPage = ctx.renderPage
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) =>{
          const providerWithApp= (props) => (
              <JssProvider registry={registry} generateId={generateId}>
                <App {...props} />
              </JssProvider>
            )
          providerWithApp.displayName='p'
          return providerWithApp
        },
      })

    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style id="server-side-styles">{registry.toString()}</style>
        </>
      ),
    }
  }
}


export default MyDocument;
