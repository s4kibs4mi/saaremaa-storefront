import Head from "next/head";
import ReactMarkdown from "react-markdown";

import { Shopemaa } from "@/core/shopemaa";
import { Shop } from "@/core/models/shop";
import { DigitalContent } from "@/core/models/digital_content";
import React, { useEffect, useState } from "react";

import DigitalContentViewer from "../../components/content_viewer";

const MyCourse = ({ shop, orderHash }: { shop: Shop, orderHash: string }) => {
  if (typeof document === "undefined") {
    return <></>;
  }

  const [selectedContent, setSelectedContent] = useState(undefined);
  const [course, setCourse] = useState(null);
  const [digitalItems, setDigitalItems] = useState(null);

  useEffect(() => {
    if (course !== null) {
      return;
    }

    Shopemaa.Api().getOrder(orderHash).then(orderResp => {
      if (orderResp.data.data !== null) {
        setCourse(orderResp.data.data.order.cart.cartItems[0].product);

        Shopemaa.Api()
          .list_digital_items_by_customer(orderHash, orderResp.data.data.order.cart.cartItems[0].product.id)
          .then(respDigitalItems => {
            if (respDigitalItems.data.data !== null) {
              setDigitalItems(respDigitalItems.data.data.productDigitalItemsByCustomer);
            }
          });
      }
    });
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
    setSelectedContent(c);
  };

  return (
    <>
      <Head>
        <title>{course ? course.name : "My Course"} - {shop.name}</title>
      </Head>

      {course && (
        <div className="container first-container">
          <div className="jumbotron jumbotron-fluid mb-3 pt-0 pb-0 bg-lightblue position-relative">
            <div className="pl-4 pr-0 h-100 tofront">
              <div className="row justify-content-between">
                <div className="col-md-6 pt-6 pb-6 align-self-center">
                  <h1 className="secondfont mb-3 font-weight-bold">{course.name}</h1>
                  <ReactMarkdown
                    source={decodeURIComponent(course.description).substring(0, 300)}
                    className="mb-3" />
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

      {digitalItems && (
        <div className="container pt-4">
          <div className="row justify-content-between">
            <DigitalContentViewer content={selectedContent} />

            <div className="col-md-12">
              <h5 className="font-weight-bold spanborder">
                <span>All Topics</span>
              </h5>
              {digitalItems.length > 0 && digitalItems
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
      )}
    </>
  );
};

export async function getServerSideProps(ctx) {
  const orderHash = ctx.query.orderHash;
  return {
    props: {
      orderHash
    }
  };
}

export default MyCourse;
