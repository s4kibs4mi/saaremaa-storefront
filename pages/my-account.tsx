import Head from "next/head";
import Link from "next/link";

import { Shop } from "@/core/models/shop";
import React, { useEffect, useState } from "react";
import { Shopemaa } from "@/core/shopemaa";
import { useRouter } from "next/router";

const MyAccount = ({ shop }: { shop: Shop }) => {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [myCourses, setMyCourses] = useState([]);

  const onLogout = () => {
    Shopemaa.setAccessToken("");
    router.push("/login");
  };

  useEffect(() => {
    if (customer !== null) {
      return;
    }

    Shopemaa.Api().customerProfile().then(resp => {
      if (resp.data.data === null) {
        router.push("/login");
        return;
      }
      setCustomer(resp.data.data.customerProfile);

      Shopemaa.Api().list_orders(1, 100).then(orderResp => {
        if (orderResp.data.data !== null) {
          setMyCourses(orderResp.data.data.orders);
        }
      });
    });
  });

  return (
    <>
      <Head>
        <title>{shop.name} - {shop.title}</title>
      </Head>

      <div className="container pt-4 mt-5">
        <div className="row justify-content-between mt-5 col-md-12 align-items-center">
          {customer && (
            <div className="mb-3 col-md-12">
              <div className="pr-3 col-md-6">
                Welcome back,
                <h2 className="mb-1 font-weight-bold">
                  {customer.firstName} {customer.lastName}
                </h2>
                <h6 className="mb-1 font-weight-bold">
                  {customer.email}
                </h6>
                <div className={"mt-3 d-flex justify-content-between"}>
                  <button className={"btn-sm btn-secondary"} onClick={() => onLogout()}>Logout</button>
                </div>
              </div>

              {myCourses && myCourses.length > 0 && (
                <div className="pr-3 col-md-4 mt-4">
                  <h2 className="mb-1 h4 font-weight-bold">
                    My Courses
                  </h2>
                  <div className={"mt-3 justify-content-between"}>
                    <ul style={{ listStyle: "none" }}>
                      {myCourses && myCourses.map((c) => (
                        <li key={c.id}><i className={"fa fa-arrow-right"} /><Link
                          href={`/my-courses/${c.hash}`}>
                          <a className={"btn-sm"}>{c.cart.cartItems[0].product.name}</a>
                        </Link></li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyAccount;
