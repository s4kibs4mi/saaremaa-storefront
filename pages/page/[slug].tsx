import Head from "next/head";
import ReactMarkdown from "react-markdown";

import { Shopemaa } from "@/core/shopemaa";
import { Shop } from "@/core/models/shop";
import { NotFound } from "@/components";
import React from "react";
import { PageModel } from "@/core/models/page";

const Page = ({ shop, page }: { page: PageModel, shop: Shop }) => {
  if (typeof document === "undefined") {
    return <></>;
  }

  if (page === null) {
    return <NotFound shop={shop} />;
  }

  return (
    <>
      <Head>
        <title>
          {page.title} - {shop.name}
        </title>
        <meta property="og:title" content={`${page.title} - ${shop.name}`} />
        {/*<meta property="og:site_name" content={config.domain} />*/}
        {/*<meta property="og:url" content={`https://${config.domain}/post/${post.slug}`} />*/}
        <meta property="og:type" content="website" />
        <meta property="og:image" content={page.bannerImage} />
        <meta property="og:description" content={decodeURIComponent(page.content).substring(0, 120)} />
        <meta name="twitter:title" content={page.title} />
        <meta name="twitter:description" content={decodeURIComponent(page.content).substring(0, 120)} />
        <meta name="twitter:image" content={page.bannerImage} />
        <meta name="twitter:card" content="summary_large_image"></meta>
        <script async src="//static.addtoany.com/menu/page.js"></script>
      </Head>

      <div className="container first-container">
        <div className="jumbotron jumbotron-fluid mb-3 pl-0 pt-0 pb-0 bg-white position-relative">
          <div className="h-100 tofront">
            <div className="row justify-content-between">
              <div className="col-md-6 pt-6 pb-6 pr-6 align-self-center">
                <h1 className="display-4 secondfont mb-3 font-weight-bold">{page.title}</h1>
                <ReactMarkdown source={decodeURIComponent(page.content).substring(0, 120)} className="mb-3" />
                <div className="d-flex align-items-center">
                  <img
                    className="rounded-circle"
                    src={shop.logo}
                    width="70"
                    height="70"
                    style={{ objectFit: "cover" }}
                    alt={shop.name}
                  />
                  <small className="ml-2">
                    {shop.name}{" "}
                    <span className="text-muted d-block">
                      {page.createdAt} &middot; {(decodeURIComponent(page.content).length / 300).toFixed(0)} mins
                    </span>
                  </small>
                </div>
              </div>
              <div className="col-md-6 pr-0">
                <img
                  src={page.bannerImage}
                  style={{ objectFit: "cover", height: "100%", width: "100%" }}
                  alt={page.title}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pt-4 pb-4">
        <div className="row justify-content-center">
          <div className="col-lg-2 pr-4 mb-4 col-md-12">
            <div className="sticky-top text-center">
              <div className="text-muted">Share this</div>
              <div className="share d-inline-block">
                <div
                  className="a2a_kit a2a_kit_size_32 a2a_default_style"
                  dangerouslySetInnerHTML={{
                    __html: `
                <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
                <a class="a2a_button_facebook"></a>
                <a class="a2a_button_twitter"></a>
                <a class="a2a_button_email"></a>
              `
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-8">
            <article className="article-post">
              <ReactMarkdown source={decodeURIComponent(page.content)} />
            </article>
            {/*{config.subscription.enabled && <Subscription />}*/}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const postResp = await Shopemaa.Api().page_by_slug(ctx.query.slug);
  if (postResp.data.data === null) {
    return {
      props: {
        page: null
      }
    };
  }

  const page = postResp.data.data.storePageBySlug;
  return {
    props: {
      page
    }
  };
}

export default Page;
