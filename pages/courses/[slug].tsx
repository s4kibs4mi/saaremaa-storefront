import Head from "next/head";
import ReactMarkdown from "react-markdown";

import { Shopemaa } from "@/core/shopemaa";
import { Shop } from "@/core/models/shop";
import { Course } from "@/core/models/course";
import { DigitalContent } from "@/core/models/digital_content";
import React, { useState } from "react";

import DigitalContentViewer from "../../components/content_viewer";
import { useRouter } from "next/router";
import Link from "next/link";
import { NotFound } from "@/components";

const CourseDetails = ({
                         shop,
                         course
                       }: { course: Course, shop: Shop }) => {
  if (course === null) {
    return (
      <>
        <NotFound shop={shop} />
      </>
    );
  }

  const router = useRouter();
  const [selectedContent, setSelectedContent] = useState(undefined);
  const [buyDisabled, setBuyDisabled] = useState(false);
  const [purchasedInfo, setPurchasedInfo] = useState(null);

  Shopemaa.Api().isCoursePurchased(course.id).then(isPurchasedResp => {
    if (isPurchasedResp.data.data !== null) {
      setPurchasedInfo(isPurchasedResp.data.data.isDigitalProductPurchasedByCustomer);
    }
  });

  const getIconByType = (c: DigitalContent) => {
    if (c.contentType === "Video") {
      return "fa fa-video";
    } else if (c.contentType === "Text") {
      return "fa fa-book";
    } else {
      return "fa fa-download";
    }
  };

  const showContentByType = (c: DigitalContent) => {
    if (!c.isTrialAllowed) {
      return;
    }

    setSelectedContent(c);
  };

  const onBuy = () => {
    setBuyDisabled(true);

    Shopemaa.Api().customerProfile().then(resp => {
      if (resp.data.data === null) {
        localStorage.setItem("login_back", location.href);
        router.push("/login");
        return;
      }

      let query = `[{ productId: "${course.id}" quantity: ${1}}]`;
      let params = {
        cartItems: query
      };
      Shopemaa.Api().createCart(params).then(cartResp => {
        if (cartResp.data.data === null) {
          setBuyDisabled(false);
          return;
        }

        const cartId = cartResp.data.data.newCart.id;
        router.push(`/checkout/${cartId}`);
      });
    });
  };

  return (
    <>
      <Head>
        <title>{course.name} - {shop.name}</title>

        <meta property="og:title" content={`${course.name} - ${shop.name}`} />
        {/*<meta property="og:site_name" content={config.domain} />*/}
        {/*<meta property="og:url" content={`https://${config.domain}/post/${post.slug}`} />*/}
        <meta property="og:type" content="website" />
        <meta property="og:image"
              content={course.fullImages && course.fullImages.length > 0 ? course.fullImages[0] : ""} />
        <meta property="og:description" content={decodeURIComponent(course.description).substring(0, 120)} />
        <meta name="twitter:title" content={course.name} />
        <meta name="twitter:description" content={decodeURIComponent(course.description).substring(0, 120)} />
        <meta name="twitter:image"
              content={course.fullImages && course.fullImages.length > 0 ? course.fullImages[0] : ""} />
        <meta name="twitter:card" content="summary_large_image"></meta>
        <script async src="//static.addtoany.com/menu/page.js"></script>
      </Head>

      {course && (
        <div className="container first-container">
          <div className="jumbotron jumbotron-fluid mb-3 pt-0 pb-0 bg-lightblue position-relative">
            <div className="pl-4 pr-0 h-100 tofront">
              <div className="row justify-content-between">
                <div className="col-md-6 pt-6 pb-6 align-self-center">
                  <h1 className="secondfont mb-3 font-weight-bold">{course.name}</h1>
                  <ReactMarkdown source={decodeURIComponent(course.description).substring(0, 120)}
                                 className="mb-3" />
                  {purchasedInfo && !purchasedInfo.isPurchased && (
                    <>
                      <span>
                    <a href={``} className="btn btn-white">
                      {course.price === 0 ? "Free" : `${(course.price / 100).toFixed(2)} ${shop.currency}`}
                    </a>
                  </span>&nbsp;
                      <button onClick={() => onBuy()} disabled={buyDisabled}
                              className="btn btn-dark">{course.price === 0 ? "Enroll" : "Buy"}</button>
                    </>
                  )}
                  {purchasedInfo && purchasedInfo.isPurchased && (
                    <>
                      <span>
                    <Link href={`/my-courses/${purchasedInfo.orderHash}`}>
                      <a href={`/my-courses/${purchasedInfo.orderHash}`} className="btn btn-white">
                      Continue course
                    </a>
                    </Link>
                  </span>
                    </>
                  )}
                  <br />
                  {course && course.attributes && course.attributes.map((a) => (
                    <>
                      <a className={"text-secondary mt-5"}>{`[${a.name}: ${a.values[0]}]`}</a>&nbsp;
                    </>
                  ))}
                </div>

                <div
                  className="col-md-6 d-none d-md-block pr-0"
                  style={{
                    backgroundImage: `url(${course.fullImages.length > 0 ? course.fullImages[0] : ""})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container pt-4">
        <div className="row justify-content-between">
          <DigitalContentViewer content={selectedContent} />

          <div className="col-md-12">
            <h5 className="font-weight-bold spanborder">
              <span>All Topics</span>
            </h5>
            {course.digitalItems.length > 0 && course.digitalItems
              .sort((a, b) => a.position - b.position)
              .map(item => {
                return (
                  <div key={item.id} className="mb-3 d-flex justify-content-between">
                    <div className="pr-3">
                      <h2 className="mb-1 h4 font-weight-bold">
                        <span>
                          <a className="text-dark">
                            {item.title}
                          </a>
                        </span>
                      </h2>

                      <ReactMarkdown source={decodeURIComponent(item.description)} />
                      <small className="text-muted">
                        {item.contents.length} contents
                      </small>

                      {item.contents.length > 0 && item.contents
                        .sort((a, b) => a.position - b.position)
                        .map(content => (
                          <li style={{ listStyle: "none" }}>
                            <i className={getIconByType(content)} />&nbsp;&nbsp;
                            {content.isTrialAllowed ? <i className={"fa fa-unlock"} /> : <i
                              className={"fa fa-lock"} />}&nbsp;&nbsp;
                            <span className={"text-primary"}
                                  onClick={() => showContentByType(content)}>{content.title}</span>
                          </li>
                        ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const courseResp = await Shopemaa.Api().product_by_slug(ctx.query.slug);
  if (courseResp.data.data === null) {
    return {
      props: {
        course: null
      }
    };
  }

  const course = courseResp.data.data.productBySlug;

  return {
    props: {
      course
    }
  };
}

export default CourseDetails;
