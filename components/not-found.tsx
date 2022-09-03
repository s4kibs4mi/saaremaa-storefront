import React from "react";
import Head from "next/head";

export const NotFound = ({ shop }) => (
  <>
    <Head>
      <title>{shop.name}</title>
      <link rel="icon" type="image/x-icon" href={shop.logo} />
    </Head>
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <h1 className="mr-3 pr-3 align-top border-right inline-block align-content-center">404</h1>
      <div className="inline-block align-middle">
        <h2 className="font-weight-normal lead" id="desc">
          The page you requested was not found.
        </h2>
      </div>
    </div>
  </>
);
