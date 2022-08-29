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

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"
              integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A=="
              crossOrigin="anonymous" />

        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/js/all.min.js"
                integrity="sha512-8pHNiqTlsrRjVD4A/3va++W1sMbUHwWxxRPWNyVlql3T+Hgfd81Qc6FC5WMXDC+tSauxxzp1tgiAvSKFu1qIlA=="
                crossOrigin="anonymous"></script>
      </Head>

      <Nav shop={pageProps.shop} menus={pageProps.menus} />
      <Component {...pageProps} />
      <Footer shop={pageProps.shop} />
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
