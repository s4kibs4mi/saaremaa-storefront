import axios, { AxiosInstance } from "axios";
import Rollbar from "rollbar";
import Keys from "@/core/keys";

export class Shopemaa {
  private client: AxiosInstance;
  private rollbar: Rollbar;

  constructor(config) {
    this.client = axios.create({
      baseURL: config.api_url,
      timeout: 10000,
      headers: this.default_headers(config.headers)
    });

    this.rollbar = new Rollbar({
      accessToken: "c4fac3fcd599468dbe1880a55e802491",
      captureUncaught: true,
      captureUnhandledRejections: true,
      environment: "saaremaa-storefront"
    });
  }

  default_headers(headers) {
    headers["Content-Type"] = "application/json";
    return headers;
  }

  Rollbar() {
    return this.rollbar;
  }

  list_categories(currentPage, limit) {
    let query = `query { categories(sort: { by: Position direction: Desc }, pagination: { perPage: ${limit} page: ${currentPage} }) { id name slug description image productCount } }`;
    return this._send_request(query);
  }

  category_by_id(id) {
    let query = `query { category(id: "${id}") { id name slug description image productCount } }`;
    return this._send_request(query);
  }

  list_banners(tag, currentPage, limit) {
    let query = `query { storeBanners(` + (tag ? ` tag: "${tag}" ` : ``) + `sort: { by: Position direction: Asc } pagination: { perPage: ${limit} page: ${currentPage} }) { imagePath imageUrl title description btnValue btnUrl tag position } }`;
    return this._send_request(query);
  }

  list_menus(tag, currentPage, limit) {
    let query = `query { storeMenus(` + (tag ? ` tag: "${tag}" ` : ``) + `sort: { by: Position direction: Asc } pagination: { perPage: ${limit} page: ${currentPage} }) { id name url tag position subMenus { id name url position } parentMenu { id name url } } }`;
    return this._send_request(query);
  }

  list_collections(currentPage, limit) {
    let query = `query { collections(sort: { by: Position direction: Desc }, pagination: { perPage: ${limit} page: ${currentPage} }) { id name slug description image productCount } }`;
    return this._send_request(query);
  }

  list_products_by_category(currentPage, limit, categoryId) {
    let query = `query { products(sort: { by: CreatedAt direction: Desc }, pagination: { perPage: ${limit} page: ${currentPage} }, search: { query: "" filters: [ { key: category value: "${categoryId}" } ] }) { id name slug description sku stock maxItemPerOrder price productSpecificDiscount productUnit images fullImages isDigitalProduct views createdAt updatedAt attributes { id name values isRequired createdAt updateAt } variations { id name price sku stock } digitalItems { id title description contents { id title contentType isTrialAllowed contentText contentUrl updatedAt } } feedbacks { rating comment createdAt } } }`;
    return this._send_request(query);
  }

  list_products_by_category_with_override_sort(sort, currentPage, limit, categoryId) {
    let query = `query { products(sort: { by: ${sort.by} direction: ${sort.direction} }, pagination: { perPage: ${limit} page: ${currentPage} }, search: { query: "" filters: [ { key: category value: "${categoryId}" } ] }) { id name slug description sku stock maxItemPerOrder price productSpecificDiscount productUnit images fullImages isDigitalProduct views createdAt updatedAt attributes { id name values isRequired createdAt updateAt } variations { id name price sku stock } digitalItems { id title description contents { id title contentType isTrialAllowed contentText contentUrl updatedAt } } feedbacks { rating comment createdAt } } }`;
    return this._send_request(query);
  }

  list_products_by_collection_with_override_sort(sort, currentPage, limit, collectionId) {
    let query = `query { products(sort: { by: ${sort.by} direction: ${sort.direction} }, pagination: { perPage: ${limit} page: ${currentPage} }, search: { query: "" filters: [ { key: collection value: "${collectionId}" } ] }) { id name slug description sku stock maxItemPerOrder price productSpecificDiscount productUnit images fullImages isDigitalProduct views createdAt updatedAt attributes { id name values isRequired createdAt updateAt } variations { id name price sku stock } digitalItems { id title description contents { id title contentType isTrialAllowed contentText contentUrl updatedAt } } feedbacks { rating comment createdAt } } }`;
    return this._send_request(query);
  }

  list_products_by_collection(currentPage, limit, collectionId) {
    let query = `query { products(sort: { by: CreatedAt direction: Desc }, pagination: { perPage: ${limit} page: ${currentPage} }, search: { query: "" filters: [ { key: collection value: "${collectionId}" } ] }) { id name slug description sku stock maxItemPerOrder price productSpecificDiscount productUnit images fullImages isDigitalProduct views createdAt updatedAt attributes { id name values isRequired createdAt updateAt } variations { id name price sku stock } digitalItems { id title description contents { id title contentType isTrialAllowed contentText contentUrl updatedAt } } feedbacks { rating comment createdAt } } }`;
    return this._send_request(query);
  }

  list_products(currentPage, limit) {
    let query = `query { products(sort: { by: CreatedAt direction: Desc }, pagination: { perPage: ${limit} page: ${currentPage} }, search: { query: "" filters: [] }) { id name slug description sku stock maxItemPerOrder price productSpecificDiscount productUnit images fullImages isDigitalProduct views createdAt updatedAt attributes { id name values isRequired createdAt updateAt } variations { id name price sku stock } digitalItems { id title description contents { id title contentType isTrialAllowed contentText contentUrl updatedAt } } feedbacks { rating comment createdAt } } }`;
    return this._send_request(query);
  }

  list_products_with_override_sort(sort, currentPage, limit) {
    let query = `query { products(sort: { by: ${sort.by} direction: ${sort.direction} }, pagination: { perPage: ${limit} page: ${currentPage} }, search: { query: "" filters: [] }) { id name slug description sku stock maxItemPerOrder price productSpecificDiscount productUnit images fullImages isDigitalProduct views createdAt updatedAt attributes { id name values isRequired createdAt updateAt } variations { id name price sku stock } digitalItems { id title description contents { id title contentType isTrialAllowed contentText contentUrl updatedAt } } feedbacks { rating comment createdAt } } }`;
    return this._send_request(query);
  }

  search_products(currentPage, limit, searchQuery) {
    let query = `query { productSearch(sort: { by: CreatedAt direction: Desc }, pagination: { perPage: ${limit} page: ${currentPage} }, search: { query: "${searchQuery}" filters: [] }) { id name slug description sku stock maxItemPerOrder price productSpecificDiscount productUnit images fullImages isDigitalProduct views createdAt updatedAt attributes { id name values isRequired createdAt updateAt } variations { id name price sku stock } digitalItems { id title description contents { id title contentType isTrialAllowed contentText contentUrl updatedAt } } feedbacks { rating comment createdAt } } }`;
    return this._send_request(query);
  }

  search_products_with_override_sort(sort, currentPage, limit, searchQuery) {
    let query = `query { productSearch(sort: { by: ${sort.by} direction: ${sort.direction} }, pagination: { perPage: ${limit} page: ${currentPage} }, search: { query: "${searchQuery}" filters: [] }) { id name slug description sku stock maxItemPerOrder price productSpecificDiscount productUnit images fullImages isDigitalProduct views createdAt updatedAt attributes { id name values isRequired createdAt updateAt } variations { id name price sku stock } digitalItems { id title description contents { id title contentType isTrialAllowed contentText contentUrl updatedAt } } feedbacks { rating comment createdAt } } }`;
    return this._send_request(query);
  }

  product_by_slug(slug) {
    let query = `query { productBySlug(productSlug: "${slug}") { id name slug description sku stock maxItemPerOrder price productSpecificDiscount productUnit images fullImages isDigitalProduct views createdAt updatedAt attributes { id name values isRequired createdAt updateAt } variations { id name price sku stock } digitalItems { id title description position contents { id title contentType isTrialAllowed contentText contentUrl position updatedAt } } feedbacks { rating comment createdAt } category { id name } } }`;
    return this._send_request(query);
  }

  getCart(cartId) {
    let query = `query { cart(cartId: "${cartId}") { id isShippingRequired cartItems { id product { id name slug description sku stock maxItemPerOrder fullImages isDigitalProduct views productUnit createdAt productSpecificDiscount } quantity purchasePrice attributes { name selectedValue } variation { id name price sku stock } } } }`;
    return this._send_request(query);
  }

  createEmptyCart() {
    let query = `mutation { newCart(params: {cartItems: []}) { id } }`;
    return this._send_request(query);
  }

  createCart(params) {
    let query = `mutation { newCart(params: { cartItems: ${params.cartItems} }) { id isShippingRequired cartItems { id product { id name slug description sku stock maxItemPerOrder productSpecificDiscount price fullImages isDigitalProduct productUnit createdAt updatedAt } quantity purchasePrice attributes { name selectedValue } variation { id name price sku stock } } } }`;
    return this._send_request(query);
  }

  updateCart(params) {
    let query = `mutation { updateCart(id: "${params.cartId}", params: { cartItems: ${params.cartItems} }) { id isShippingRequired cartItems { id product { id name slug description sku stock maxItemPerOrder productSpecificDiscount price fullImages isDigitalProduct productUnit createdAt updatedAt } quantity purchasePrice attributes { name selectedValue } variation { id name price sku stock } } } }`;
    return this._send_request(query);
  }

  list_locations() {
    let query = "query { locations { id name shortCode } }";
    return this._send_request(query);
  }

  list_shipping_methods() {
    let query = "query { shippingMethods { id displayName deliveryCharge deliveryTimeInDays WeightUnit isFlat isActive } }";
    return this._send_request(query);
  }

  list_payment_methods() {
    let query = "query { paymentMethods { id displayName currencyName currencySymbol isDigitalPayment } }";
    return this._send_request(query);
  }

  getShippingCharge(cartId, shippingMethodId) {
    let query = `query { checkShippingCharge(shippingMethodId: "${shippingMethodId}", cartId: "${cartId}") }`;
    return this._send_request(query);
  }

  getPaymentProcessingCharge(cartId, shippingMethodId, paymentMethodId) {
    let query = `query { checkPaymentProcessingFee(cartId: "${cartId}" ${shippingMethodId !== null ? `shippingMethodId: ${shippingMethodId}` : ""} paymentMethodId: "${paymentMethodId}") }`;
    return this._send_request(query);
  }

  applyCouponCode(couponCode, cartId, shippingMethodId) {
    let query = `query { checkDiscountForGuests(couponCode: "${couponCode}", cartId: "${cartId}" ${shippingMethodId !== null ? `, shippingMethodId: "${shippingMethodId}"` : ``}) }`;
    return this._send_request(query);
  }

  checkout(query) {
    return this._send_request(query);
  }

  generate_payment_nonce_for_guest_checkout(orderId, customerEmail) {
    let query = `mutation { orderGeneratePaymentNonceForGuest(orderId: "${orderId}", customerEmail: "${customerEmail}") { PaymentGatewayName Nonce StripePublishableKey } }`;
    return this._send_request(query);
  }

  getOrderByGuest(orderHash, email) {
    let query = `query { orderByCustomerEmail(hash: "${orderHash}", email: "${email}") { id hash shippingCharge paymentProcessingFee subtotal grandTotal discountedAmount status paymentStatus createdAt updatedAt billingAddress { id street streetTwo city state postcode email phone location { id name shortCode } } shippingAddress { id street streetTwo city state postcode email phone location { id name shortCode } } cart { isShippingRequired cartItems { product { id name slug description fullImages isDigitalProduct productUnit } quantity purchasePrice attributes { name selectedValue } variation { id name price sku stock } } } customer { email phone firstName lastName profilePicture } paymentMethod { id displayName currencyName currencySymbol isDigitalPayment } shippingMethod { id displayName deliveryCharge deliveryTimeInDays WeightUnit isFlat isActive } couponCode { code } payments { isPaid payableAmount gatewayName } } }`;
    return this._send_request(query);
  }

  getOrder(orderHash) {
    let query = `query { order(hash: "${orderHash}") { id hash shippingCharge paymentProcessingFee subtotal grandTotal discountedAmount status paymentStatus createdAt updatedAt billingAddress { id street streetTwo city state postcode email phone location { id name shortCode } } shippingAddress { id street streetTwo city state postcode email phone location { id name shortCode } } cart { isShippingRequired cartItems { product { id name slug description fullImages isDigitalProduct productUnit attributes { id name values isRequired createdAt updateAt } } quantity purchasePrice attributes { name selectedValue } variation { id name price sku stock } } } customer { email phone firstName lastName profilePicture } paymentMethod { id displayName currencyName currencySymbol isDigitalPayment } shippingMethod { id displayName deliveryCharge deliveryTimeInDays WeightUnit isFlat isActive } couponCode { code } payments { isPaid payableAmount gatewayName } } }`;
    return this._send_request(query);
  }

  list_digital_items_by_customer(orderHash, productId) {
    let query = `query { productDigitalItemsByCustomer(orderHash: "${orderHash}", productId: "${productId}") { id title description position contents { id title contentType isTrialAllowed contentText contentUrl updatedAt position } } }`;
    return this._send_request(query);
  }

  list_orders(currentPage, limit) {
    let query = `query { orders(sort: { by: CreatedAt direction: Desc }, pagination: { perPage: ${limit} page: ${currentPage} }) { id hash shippingCharge paymentProcessingFee subtotal grandTotal discountedAmount status paymentStatus createdAt updatedAt billingAddress { id street streetTwo city state postcode email phone location { id name shortCode } } shippingAddress { id street streetTwo city state postcode email phone location { id name shortCode } } cart { isShippingRequired cartItems { product { id name slug description fullImages isDigitalProduct productUnit } quantity purchasePrice attributes { name selectedValue } variation { id name price sku stock } } } customer { email phone firstName lastName profilePicture } paymentMethod { id displayName currencyName currencySymbol isDigitalPayment } shippingMethod { id displayName deliveryCharge deliveryTimeInDays WeightUnit isFlat isActive } couponCode { code } payments { isPaid payableAmount gatewayName } } }`;
    return this._send_request(query);
  }

  getStoreBySecret() {
    let query = `query { storeBySecret { name title description tags metaName metaDescription metaTags logo favicon bannerImage isOpen currency website supportEmail supportPhone createdAt updatedAt street streetOptional city state postcode location { id name shortCode } } }`;
    return this._send_request(query);
  }

  page_by_slug(slug) {
    let query = `query { storePageBySlug(slug: "${slug}") { title slug content } }`;
    return this._send_request(query);
  }

  blogPosts(currentPage, limit) {
    let query = `query { blogPosts(sort: { by: CreatedAt direction: Desc }, pagination: { perPage: ${limit} page: ${currentPage} }, search: { query: "" filters: [] }) { id title slug bannerImage content tags isPublished isFeatured views favourites createdAt updatedAt comments { id content customer { email phone firstName lastName profilePicture } createdAt } } }`;
    return this._send_request(query);
  }

  blogPostBySlug(slug) {
    let query = `query { blogPostBySlug(slug: "${slug}")  { id title slug bannerImage content tags isPublished isFeatured views favourites createdAt updatedAt comments { id content customer { email phone firstName lastName profilePicture } createdAt } } }`;
    return this._send_request(query);
  }

  isCoursePurchased(courseId) {
    let query = `query { isDigitalProductPurchasedByCustomer(productId: "${courseId}") { isPurchased orderHash purchaseDate } }`;
    return this._send_request(query);
  }

  sendMagicLoginRequest(email) {
    let url = "http://localhost:3000/magic?token=%s";
    let query = `mutation { customerMagicLoginRequest(params: { email: "${email}" storefrontUrl: "${url}" }) }`;
    return this._send_request(query);
  }

  magicLogin(token) {
    let query = `mutation { customerMagicLogin(params: { token: "${token}" }) { accessToken refreshToken } }`;
    return this._send_request(query);
  }

  customerProfile() {
    let query = `query { customerProfile { email firstName lastName profilePicture phone } }`;
    return this._send_request(query);
  }

  _send_request(query) {
    let reqBody = {
      "query": query
    };

    if (Shopemaa.getAccessToken() !== "") {
      let headers = this.client.defaults.headers;
      headers["access-token"] = Shopemaa.getAccessToken();
      return this.client.post("/query", reqBody, {
        headers: this.default_headers(headers)
      });
    }
    return this.client.post("/query", reqBody);
  }

  static setAccessToken(token) {
    if (typeof localStorage === "undefined") {
      return;
    }
    localStorage.setItem(Keys.keyAccessToken(), token);
  }

  static getAccessToken() {
    if (typeof localStorage === "undefined") {
      return "";
    }
    return localStorage.getItem(Keys.keyAccessToken()) === null ? "" : localStorage.getItem(Keys.keyAccessToken());
  }

  static Api(): Shopemaa {
    return new Shopemaa({
      "api_url": process.env.NEXT_PUBLIC_URL || "https://api.shopemaa.com",
      "headers": {
        "store-key": process.env.NEXT_PUBLIC_APP_KEY,
        "store-secret": process.env.NEXT_PUBLIC_APP_SECRET
      }
    });
  }
}
