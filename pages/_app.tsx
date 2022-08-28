import App from "next/app";
import Head from "next/head";

import "../styles/main.scss";

import { Nav, Footer } from "@/components";
import { Shopemaa } from "@/core/shopemaa";

const CustomApp = ({
                     Component,
                     pageProps,
                     isErrorPage
                   }: {
  Component: any;
  pageProps: any;
  isErrorPage: boolean;
}) => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Playfair+Display:400,700|Source+Sans+Pro:400,600,700"
          rel="stylesheet" />
      </Head>

      {!isErrorPage && <Nav shop={pageProps.shop} menus={pageProps.menus} />}

      <Component {...pageProps} />

      {!isErrorPage && <Footer shop={pageProps.shop} />}
    </>
  );
};

CustomApp.getInitialProps = async (context) => {
  const appProps = await App.getInitialProps(context);

  if (!appProps.pageProps.shop) {
    const shopResp = await Shopemaa.Api().getStoreBySecret();
    appProps.pageProps.shop = shopResp.data.data.storeBySecret;
  }

  if (!appProps.pageProps.menus) {
    const menusResp = await Shopemaa.Api().list_menus(null, 1, 100);
    appProps.pageProps.menus = menusResp.data.data.storeMenus;
  }

  const isErrorPage = context.ctx.res.statusCode === 404 || false;
  return { ...appProps, isErrorPage };
};

export default CustomApp;
