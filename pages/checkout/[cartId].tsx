import Head from "next/head";

import { Shop } from "@/core/models/shop";
import React, { useEffect, useState } from "react";
import { Shopemaa } from "@/core/shopemaa";
import { Cart } from "@/core/models/cart";
import { Location } from "@/core/models/location";
import { PaymentMethod } from "@/core/models/payment_method";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import { NotFound } from "@/components";

const checkoutBillingParams = {
  street: "",
  state: "",
  postcode: "",
  city: "",
  countryId: ""
};

const Checkout = ({
                    shop,
                    cart,
                    locations,
                    paymentMethods
                  }: { shop: Shop, cart: Cart, locations: Location[], paymentMethods: PaymentMethod[] }) => {
  if (cart === null) {
    return <NotFound shop={shop} />;
  }

  const [total, setTotal] = useState(0);
  const [courseFee, setCourseFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [courseDiscount, setCourseDiscount] = useState(0);
  const [paymentFee, setPaymentFee] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [disableCompletePurchase, setDisableCompletePurchase] = useState(false);
  const [customer, setCustomer] = useState(null);

  const router = useRouter();

  useEffect(() => {
    setCourseFee(cart.cartItems[0].purchasePrice);
    if (cart.cartItems[0].product.productSpecificDiscount) {
      setCourseDiscount((courseFee * cart.cartItems[0].product.productSpecificDiscount) / 100);
    }

    setTotal(courseFee + paymentFee - discount - courseDiscount);

    Shopemaa.Api().getPaymentProcessingCharge(cart.id, null, paymentMethods[0].id)
      .then(pmResp => {
        if (pmResp.data.data !== null) {
          setPaymentFee(pmResp.data.data.checkPaymentProcessingFee);
        }
      });

    Shopemaa.Api().customerProfile().then(csResp => {
      if (csResp.data.data !== null) {
        setCustomer(csResp.data.data.customerProfile);
      }
    });
  }, [total, courseFee, discount, courseDiscount, paymentFee]);

  const onCheckout = () => {
    setDisableCompletePurchase(true);

    let params = `{`;
    params += `cartId: "${cart.id}" `;
    params += `billingAddress: { street: "${checkoutBillingParams.street}" city: "${checkoutBillingParams.city}" state: "${checkoutBillingParams.state}" postcode: "${checkoutBillingParams.postcode}" email: "${customer.email}" locationId: "${checkoutBillingParams.countryId}" } `;
    params += `paymentMethodId: "${paymentMethods[0].id}" `;
    params += `couponCode: "${discount !== 0 ? coupon : ``}" `;
    params += `firstName: "${customer.firstName}" `;
    params += `lastName: "${customer.lastName}" `;
    params += `email: "${customer.email}" `;
    params += `}`;
    let checkoutQuery = `mutation { orderGuestCheckout(params: ${params} ) { id hash } }`;

    Shopemaa.Api().checkout(checkoutQuery).then(checkoutResp => {
      if (checkoutResp.data.data === null) {
        setDisableCompletePurchase(false);
        return;
      }

      const cart = checkoutResp.data.data.orderGuestCheckout;
      if (total === 0) {
        router.push("/my-account");
        return;
      }

      Shopemaa.Api().generate_payment_nonce_for_guest_checkout(cart.id, customer.email).then(async nonceResp => {
        if (nonceResp.data.data.orderGeneratePaymentNonceForGuest === null) {
          setDisableCompletePurchase(false);
          return;
        }

        const nonce = nonceResp.data.data.orderGeneratePaymentNonceForGuest;
        if (nonce.PaymentGatewayName === "Stripe") {
          const stripePromise = loadStripe(
            nonce.StripePublishableKey
          );
          const stripe = await stripePromise;
          stripe.redirectToCheckout({ sessionId: nonce.Nonce });
        } else if (nonce.PaymentGatewayName === "SSLCommerz") {
          window.location.href = nonce.Nonce;
        } else {
          console.log("Unknown payment gateway");
        }
      });
    });
  };

  const onApplyCoupon = () => {
    if (coupon.trim() === "") {
      return;
    }

    Shopemaa.Api().applyCouponCode(coupon.trim(), cart.id, null)
      .then(cpResp => {
        if (cpResp.data.data !== null) {
          setDiscount(cpResp.data.data.checkDiscountForGuests);
          return;
        }

        setCoupon("");
      });
  };

  return (
    <>
      <Head>
        <title>Checkout - {shop.name}</title>
        <link rel="icon" type="image/x-icon" href={shop.logo} />
      </Head>

      <div className="container pt-4 mt-5">
        <div className="row justify-content-between mt-5">
          <div className="mb-3 col-12">
            <div className="pr-3 col-md-12 mb-3">
              <span>Course Name</span>
              <h2 className="mb-1 h4 font-weight-bold">
                {cart.cartItems[0].product.name}
              </h2>
            </div>
            <hr />

            <div className="pr-3 col-md-12">
              <table className="pr-3 col-md-12">
                <tr className="col-md-12">
                  <td className="col-md-6">
                    <div className="col-md-12">
                      <h2 className="mb-1 h4 font-weight-bold">
                        Billing Details
                      </h2>
                      <div className={"mt-3 justify-content-between"}>
                        <input onChange={(e) => {
                          checkoutBillingParams.street = e.target.value;
                        }} type={"text"} className={"form form-control col-12"} name={""}
                               placeholder={"Type street"} />
                        <input onChange={(e) => {
                          checkoutBillingParams.state = e.target.value;
                        }} type={"text"} className={"form form-control col-12 mt-1"} name={""}
                               placeholder={"Type state"} />
                        <input onChange={(e) => {
                          checkoutBillingParams.postcode = e.target.value;
                        }} type={"text"} className={"form form-control col-12 mt-1"} name={""}
                               placeholder={"Type postcode"} />
                        <input onChange={(e) => {
                          checkoutBillingParams.city = e.target.value;
                        }} type={"text"} className={"form form-control col-12 mt-1"} name={""}
                               placeholder={"Type city"} />
                        <select onChange={(e) => {
                          checkoutBillingParams.countryId = e.target.value;
                        }} className={"form-control mt-1"}>
                          {locations && locations.map(l => (
                            <option value={l.id}>{l.name}</option>
                          ))}
                        </select>
                        <button disabled={disableCompletePurchase} className={"btn btn-dark col-12 mt-1"}
                                onClick={() => onCheckout()}>Complete Purchase
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="col-md-6">
                    <div className="col-md-8">
                      <h2 className="mb-1 h4 font-weight-bold text-center">
                        Overview
                      </h2>
                      <div className={"mt-3 justify-content-between"}>
                        <table>
                          <tr>
                            <td className={"col-3 text-center"}>Course fee</td>
                            <td className={"col-3 text-left"}>{(courseFee / 100).toFixed(2)} {shop.currency}</td>
                          </tr>
                          <tr>
                            <td className={"col-3 text-center"}>Discount</td>
                            <td
                              className={"col-3 text-left"}>{((discount + courseDiscount) / 100).toFixed(2)} {shop.currency}</td>
                          </tr>
                          <tr>
                            <td className={"col-3 text-center"}>Payment Fee</td>
                            <td className={"col-3 text-left"}>{(paymentFee / 100).toFixed(2)} {shop.currency}</td>
                          </tr>
                          <tr>
                            <td className={"col-3 text-center text-primary"}>Total</td>
                            <td
                              className={"col-3 text-left text-primary"}>{(total / 100).toFixed(2)} {shop.currency}</td>
                          </tr>
                        </table>

                        <input onChange={(e) => {
                          setCoupon(e.target.value);
                        }} type={"text"} className={"form-control-sm form-control col-12 mt-2"} name={""}
                               placeholder={"Coupon code"} value={coupon} />
                        <button className={"btn-sm btn-dark col-12 mt-1"} onClick={() => onApplyCoupon()}>Apply</button>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const [cartResp, locationsResp, paymentMethodsResp] = await Promise.all([
    Shopemaa.Api().getCart(ctx.params.cartId),
    Shopemaa.Api().list_locations(),
    Shopemaa.Api().list_payment_methods()
  ]);

  if (cartResp.data.data === null) {
    return {
      props: {
        cart: null
      }
    };
  }

  const cart = cartResp.data.data.cart;
  const locations = locationsResp.data.data.locations;
  const paymentMethods = paymentMethodsResp.data.data.paymentMethods;

  return {
    props: {
      cart,
      locations,
      paymentMethods
    }
  };
}

export default Checkout;
