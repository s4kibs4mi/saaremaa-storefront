import Head from "next/head";
import ReactMarkdown from "react-markdown";

import { Shopemaa } from "@/core/shopemaa";
import { Shop } from "@/core/models/shop";
import { NotFound } from "@/components";
import React from "react";
import { PageModel } from "@/core/models/page";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

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
        <link rel="icon" type="image/x-icon" href={shop.logo} />
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
              <ReactMarkdown className={"col-12 col-md-12"}
                             components={{
                               code({ node, inline, className, children, ...props }) {
                                 const match = /language-(\w+)/.exec(className || "");
                                 return !inline && match ? (
                                   <SyntaxHighlighter
                                     children={String(children).replace(/\n$/, "")}
                                     style={dracula}
                                     language={match[1]}
                                     PreTag="div"
                                     {...props}
                                   />
                                 ) : (
                                   <code className={className} {...props}>
                                     {children}
                                   </code>
                                 );
                               }
                             }}>{decodeURIComponent(page.content)}</ReactMarkdown>
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
