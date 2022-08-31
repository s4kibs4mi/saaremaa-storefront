import App from "next/app";

import "../styles/main.scss";

import { Nav, Footer } from "@/components";
import { Shopemaa } from "@/core/shopemaa";
import React from "react";

const CustomApp = ({
                     Component,
                     pageProps
                   }: {
  Component: any;
  pageProps: any;
}) => {
  const isBrowser = typeof document !== "undefined";
  return (
    <>
      {isBrowser ? <Nav shop={pageProps.shop} menus={pageProps.menus} /> : null}
      {isBrowser ? <Component {...pageProps} /> : null}
      {isBrowser ? <Footer shop={pageProps.shop} /> : null}
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

  return { ...appProps };
};

export default CustomApp;
