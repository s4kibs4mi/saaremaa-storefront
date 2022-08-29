import Head from "next/head";

import { Shop } from "@/core/models/shop";
import React, { useEffect, useState } from "react";
import { Shopemaa } from "@/core/shopemaa";
import { useRouter } from "next/router";

const MyAccount = ({ shop }: { shop: Shop }) => {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);

  const onLogout = () => {
    Shopemaa.setAccessToken("");
    router.push("/login");
  };

  useEffect(() => {
    Shopemaa.Api().customerProfile().then(resp => {
      if (resp.data.data === null) {
        router.push("/login");
        return;
      }
      setCustomer(resp.data.data.customerProfile);
    });
  });

  return (
    <>
      <Head>
        <title>{shop.name} - {shop.title}</title>
      </Head>

      <div className="container pt-4 mt-5">
        <div className="row justify-content-between mt-5 col-12 align-items-center">
          {customer && (
            <div className="mb-3 d-flex justify-content-between col-12">
              <div className="pr-3 col-md-6">
                Welcome back,
                <h2 className="mb-1 font-weight-bold">
                  {customer.firstName} {customer.lastName}
                </h2>
                <h6 className="mb-1 font-weight-bold">
                  {customer.email}
                </h6>
                <div className={"mt-3 d-flex justify-content-between"}>
                  <button className={"btn btn-secondary"} onClick={() => onLogout()}>Logout</button>
                </div>
              </div>

              <div className="pr-3 col-md-4">
                <h2 className="mb-1 h4 font-weight-bold">
                  My Courses
                </h2>
                <div className={"mt-3 justify-content-between"}>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyAccount;
