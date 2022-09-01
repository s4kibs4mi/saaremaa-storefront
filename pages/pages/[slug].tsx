import Head from "next/head";
import ReactMarkdown from "react-markdown";

import { Shopemaa } from "@/core/shopemaa";
import { Shop } from "@/core/models/shop";
import { NotFound } from "@/components";
import React from "react";
import { PageModel } from "@/core/models/page";

const Page = ({ shop, page }: { page: PageModel, shop: Shop }) => {
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
        <div className="jumbotron jumbotron-fluid pl-0 pt-0 pb-0 bg-white position-relative">
          <div className="h-100 tofront">
            <div className="row justify-content-between">
              <div className="col-md-6 pt-6 pr-6 align-self-center">
                <h1 className="display-4 secondfont font-weight-bold">{page.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-4">
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-12">
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
