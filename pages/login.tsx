import Head from "next/head";

import { Shopemaa } from "@/core/shopemaa";
import { Shop } from "@/core/models/shop";
import React from "react";

const Login = ({ shop }: { shop: Shop }) => {
  return (
    <>
      <Head>
        <title>{shop.name} - {shop.title}</title>
      </Head>

      <div className="container pt-4 mt-5">
        <div className="row justify-content-between mt-5 col-12 align-items-center">
          <div className="mb-3 d-flex justify-content-between col-12">
            <div className="pr-3 col-6">
              <h2 className="mb-1 h4 font-weight-bold">
                Log In
              </h2>
              <div className={"mt-3 d-flex justify-content-between"}>
                <input className={"form form-control col-8"} name={""} placeholder={"Type email address"} />
                <button className={"btn btn-dark col-4 ml-2"}>Send magic link</button>
              </div>
            </div>

            <div className="pr-3 col-6">
              <h2 className="mb-1 h4 font-weight-bold">
                Sign Up
              </h2>
              <div className={"mt-3 d-flex justify-content-between"}>
                <input className={"form form-control col-8"} name={""} placeholder={"Type email address"} />
                <button className={"btn btn-dark col-4 ml-2"}>Send magic link</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps = async () => {
  const postsResp = await Shopemaa.Api().blogPosts(1, 100);
  const posts = postsResp.data.data.blogPosts;
  return {
    props: {
      posts
    },
    revalidate: 1
  };
};

export default Login;
