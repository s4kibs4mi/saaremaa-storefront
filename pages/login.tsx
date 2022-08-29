import Head from "next/head";

import { Shop } from "@/core/models/shop";
import React from "react";
import { Shopemaa } from "@/core/shopemaa";

const loginParams = {
  email: ""
};

const createAccountParams = {
  firstName: "",
  lastName: "",
  email: "",
  password: ""
};

const Login = ({ shop }: { shop: Shop }) => {

  const onLogin = () => {
    Shopemaa.Api().sendMagicLoginRequest(loginParams.email).then(res => {
      if (res.data.data) {
        alert("Sent");
        return;
      }
    });
  };

  const createAccount = () => {

  };

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
                <input onChange={(e) => {
                  loginParams.email = e.target.value;
                }} className={"form form-control col-8"} name={""} placeholder={"Type email address"} />
                <button className={"btn btn-dark col-4 ml-2"} onClick={() => onLogin()}>Send magic link</button>
              </div>
            </div>

            <div className="pr-3 col-4">
              <h2 className="mb-1 h4 font-weight-bold">
                Sign Up
              </h2>
              <div className={"mt-3 justify-content-between"}>
                <input onChange={(e) => {
                  createAccountParams.firstName = e.target.value;
                }} type={"text"} className={"form form-control col-12"} name={""}
                       placeholder={"Type first name"} />
                <input onChange={(e) => {
                  createAccountParams.lastName = e.target.value;
                }} type={"email"} className={"form form-control col-12 mt-2"} name={""}
                       placeholder={"Type last name"} />
                <input onChange={(e) => {
                  createAccountParams.email = e.target.value;
                }} type={"email"} className={"form form-control col-12 mt-2"} name={""}
                       placeholder={"Type email address"} />
                <input onChange={(e) => {
                  createAccountParams.password = e.target.value;
                }} type={"password"} className={"form form-control col-12 mt-2"} name={""}
                       placeholder={"Type password"} />
                <button className={"btn btn-dark col-12 mt-2"} onClick={() => createAccount()}>Create Account</button>
                <p
                  className={"text-muted col-12 mt-3"} style={{ fontSize: "12px" }}>
                  Create account to agree to Terms of Service and acknowledge that the Privacy Policy applies to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
