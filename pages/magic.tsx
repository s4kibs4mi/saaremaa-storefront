import React, { useEffect } from "react";
import { Shopemaa } from "@/core/shopemaa";
import { useRouter } from "next/router";

const Magic = ({ token, isValid }: { token: string, isValid: boolean }) => {
  const router = useRouter();

  useEffect(() => {
    if (isValid) {
      Shopemaa.setAccessToken(token);
      router.push("/my-account");
      return;
    }

    router.push("/login");
  });

  return (
    <></>
  );
};

export async function getServerSideProps(ctx) {
  console.log(ctx.query.token);

  const loginResp = await Shopemaa.Api().magicLogin(ctx.query.token);
  if (loginResp.data.data === null) {
    return {
      props: {
        token: "",
        isValid: false
      }
    };
  }

  const resp = loginResp.data.data.customerMagicLogin;
  return {
    props: {
      token: resp.accessToken,
      isValid: true
    }
  };
}

export default Magic;
