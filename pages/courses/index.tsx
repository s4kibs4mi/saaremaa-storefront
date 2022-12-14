import Head from "next/head";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { Shopemaa } from "@/core/shopemaa";
import { Shop } from "@/core/models/shop";
import { Course } from "@/core/models/course";
import React, { useState } from "react";

const Courses = ({ courses, shop }: { courses: Course[], shop: Shop }) => {
  const [currentPage, setCurrentPage] = useState(2);
  const [hideLoadMore, setHideLoadMore] = useState(courses.length === 0);
  const [firstCourse] = courses;

  const onLoadMore = () => {
    let sort = {
      by: "CreatedAt",
      direction: "Desc"
    };
    Shopemaa.Api().list_products_with_override_sort(sort, currentPage, 8).then(coursesResp => {
      if (coursesResp.data.data === null) {
        return;
      }

      coursesResp.data.data.products.forEach(v => courses.push(v));
      setCurrentPage(currentPage + 1);
      if (coursesResp.data.data.products && coursesResp.data.data.products.length === 0) {
        setHideLoadMore(true);
      }
    });
  };

  return (
    <>
      <Head>
        <title>Courses - {shop.name}</title>
        <link rel="icon" type="image/x-icon" href={shop.logo} />
      </Head>

      {firstCourse && (
        <div className="container first-container">
          <div className="jumbotron jumbotron-fluid mb-3 pt-0 pb-0 bg-lightblue position-relative">
            <div className="pl-4 pr-0 h-100 tofront">
              <div className="row justify-content-between">
                <div className="col-md-6 pt-6 pb-6 align-self-center">
                  <h1 className="secondfont mb-3 font-weight-bold">{firstCourse.name}</h1>
                  <ReactMarkdown
                    className="mb-3">{decodeURIComponent(firstCourse.description).substring(0, 120)}</ReactMarkdown>
                  <span>
                    <a href={``} className="btn btn-white">
                      {firstCourse.price === 0 ? "Free" : `${(firstCourse.price / 100).toFixed(2)} ${shop.currency}`}
                    </a>
                  </span>&nbsp;

                  <Link href={`/courses/${firstCourse.slug}`}>
                    <a href={`/courses/${firstCourse.slug}`} className="btn btn-dark">
                      View Course
                    </a>
                  </Link>
                </div>
                <div
                  className="col-md-6 d-none d-md-block pr-0"
                  style={{
                    backgroundImage: `url(${firstCourse.fullImages.length > 0 ? firstCourse.fullImages[0] : ""})`,
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
          {courses && courses.length > 0 && (
            <div className="col-md-12">
              <h5 className="font-weight-bold spanborder">
                <span>All Courses</span>
              </h5>
              {courses.map((course) => {
                return (
                  <div key={course.slug} className="mb-3 d-flex justify-content-between">
                    <div className="pr-3">
                      <h2 className="mb-1 h4 font-weight-bold">
                        <Link href={`/courses/${course.slug}`}>
                          <a href={`/courses/${course.slug}`} className="text-dark">
                            {course.name}
                          </a>
                        </Link>
                      </h2>
                      <ReactMarkdown>{decodeURIComponent(course.description).substring(0, 200)}</ReactMarkdown>
                      <div className="card-text text-muted small">
                        {shop.name}
                      </div>
                      <small className="text-muted">
                      <span
                        className={"text-danger"}>{course.price === 0 ? "Free" : `${(course.price / 100).toFixed(2)} ${shop.currency}`}</span> &middot; {course.createdAt} &middot; {course.digitalItems.length} topics
                      </small>
                    </div>
                    <img height="120" src={course.fullImages.length > 0 ? course.fullImages[0] : ""}
                         alt={course.name} />
                  </div>
                );
              })}
            </div>
          )}
          {courses && courses.length === 0 && (
            <h3>No course found</h3>
          )}
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
  let sort = {
    by: "CreatedAt",
    direction: "Desc"
  };
  const coursesResp = await Shopemaa.Api().list_products_with_override_sort(sort, 1, 8);
  const courses = coursesResp.data.data.products;
  return {
    props: {
      courses
    },
    revalidate: 1
  };
};

export default Courses;
