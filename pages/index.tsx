import Head from "next/head";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { Post } from "@/core/models";
import { Shopemaa } from "@/core/shopemaa";
import { Shop } from "@/core/models/shop";
import React, { useState } from "react";

const Home = ({ posts, shop }: { posts: Post[], shop: Shop }) => {
  const [currentPage, setCurrentPage] = useState(2);
  const [hideLoadMore, setHideLoadMore] = useState(posts.length === 0);
  const [firstPost] = posts;

  const onLoadMore = () => {
    Shopemaa.Api().blogPosts(currentPage, 8).then(postsResp => {
      if (postsResp.data.data === null) {
        return;
      }

      postsResp.data.data.blogPosts.forEach(v => posts.push(v));
      setCurrentPage(currentPage + 1);
      if (postsResp.data.data.blogPosts && postsResp.data.data.blogPosts.length === 0) {
        setHideLoadMore(true);
      }
    });
  };

  return (
    <>
      <Head>
        <title>{shop.name} - {shop.title}</title>
        <link rel="icon" type="image/x-icon" href={shop.logo} />
      </Head>

      {firstPost && (
        <div className="container first-container">
          <div className="jumbotron jumbotron-fluid mb-3 pt-0 pb-0 bg-lightblue position-relative">
            <div className="pl-4 pr-0 h-100 tofront">
              <div className="row justify-content-between">
                <div className="col-md-6 pt-6 pb-6 align-self-center">
                  <h1 className="secondfont mb-3 font-weight-bold">{firstPost.title}</h1>
                  <ReactMarkdown
                    className="mb-3">{decodeURIComponent(firstPost.content).substring(0, 120)}</ReactMarkdown>
                  <Link href={`/posts/${firstPost.slug}`}>
                    <a href={`/posts/${firstPost.slug}`} className="btn btn-dark">
                      Read More
                    </a>
                  </Link>
                </div>
                <div
                  className="col-md-6 d-none d-md-block pr-0"
                  style={{
                    backgroundImage: `url(${firstPost.bannerImageFull})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center"
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container pt-4">
        <div className="row justify-content-between">
          <div className="col-md-12">
            <h5 className="font-weight-bold spanborder">
              <span>All Stories</span>
            </h5>
            {posts.map((post) => {
              return (
                <div key={post.slug} className="mb-3 d-flex justify-content-between">
                  <div className="pr-3">
                    <h2 className="mb-1 h4 font-weight-bold">
                      <Link href={`/posts/${post.slug}`}>
                        <a href={`/posts/${post.slug}`} className="text-dark">
                          {post.title}
                        </a>
                      </Link>
                    </h2>
                    <ReactMarkdown>{decodeURIComponent(post.content).substring(0, 200)}</ReactMarkdown>
                    <div className="card-text text-muted small">
                      {shop.name}
                    </div>
                    <small className="text-muted">
                      {post.createdAt} &middot; {(decodeURIComponent(post.content).length / 300).toFixed(0)} mins
                    </small>
                  </div>
                  <img height="120" src={post.bannerImageFull} alt={post.title} />
                </div>
              );
            })}
          </div>
        </div>

        {!hideLoadMore && (
          <a onClick={e => {
            e.preventDefault();
            onLoadMore();
          }} className="btn btn-primary mt-3">
            Load More
          </a>
        )}

      </div>
    </>
  );
};

export const getStaticProps = async () => {
  const postsResp = await Shopemaa.Api().blogPosts(1, 8);
  const posts = postsResp.data.data.blogPosts;
  return {
    props: {
      posts
    },
    revalidate: 1
  };
};

export default Home;
