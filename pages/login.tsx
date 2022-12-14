import Head from "next/head";

import { Shop } from "@/core/models/shop";
import React, { useEffect, useState } from "react";
import { Shopemaa } from "@/core/shopemaa";
import { AlertMeta } from "@/components";
import { useRouter } from "next/router";

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
  const [alert, setAlert] = useState<AlertMeta>();
  const router = useRouter();

  const onLogin = () => {
    Shopemaa.Api().sendMagicLoginRequest(loginParams.email, location.href.replace("login", "")).then(res => {
      if (res.data.data) {
        setAlert({
          class: "success",
          message: "Email sent, please check your mailbox."
        });
        return;
      }
    });
  };

  const createAccount = () => {
    Shopemaa.Api().customerRegister(createAccountParams.email, createAccountParams.password, createAccountParams.firstName, createAccountParams.lastName).then(res => {
      if (res.data.data) {
        setAlert({
          class: "success",
          message: "Account created"
        });
        Shopemaa.setAccessToken(res.data.data.customerRegister.accessToken);
        router.push("/my-account");
        return;
      }
    });
  };

  useEffect(() => {
    setTimeout(function() {
      setAlert(null);
    }, 2000);
  }, [alert]);

  return (
    <>
      <Head>
        <title>Login - {shop.name}</title>
        <link rel="icon" type="image/x-icon" href={shop.logo} />
      </Head>

      <div className="container pt-4 mt-5">
        <div className="row justify-content-between mt-5">
          <div className="mb-3 col-12">
            <div className="pr-3 col-md-6 mb-3">
              <h2 className="mb-1 h4 font-weight-bold">
                Log In
              </h2>
              {alert && (
                <div className={`alert alert-${alert.class}`} role="alert">
                  {alert.message}
                </div>
              )}
              <div className={"mt-3 d-flex justify-content-between"}>
                <input onChange={(e) => {
                  loginParams.email = e.target.value;
                }} className={"form form-control col-8"} name={""} placeholder={"Type email address"} />
                <button className={"btn btn-dark col-4 ml-2"} onClick={() => onLogin()}>Send link</button>
              </div>
            </div>

            <div className="pr-3 col-md-4">
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
