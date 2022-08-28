import Head from "next/head";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { Shopemaa } from "@/core/shopemaa";
import { Shop } from "@/core/models/shop";
import { Course } from "@/core/models/course";

const Courses = ({ courses, shop }: { courses: Course[], shop: Shop }) => {
  const [firstCourse] = courses;

  return (
    <>
      <Head>
        <title>{shop.name} - Courses</title>
      </Head>

      {firstCourse && (
        <div className="container first-container">
          <div className="jumbotron jumbotron-fluid mb-3 pt-0 pb-0 bg-lightblue position-relative">
            <div className="pl-4 pr-0 h-100 tofront">
              <div className="row justify-content-between">
                <div className="col-md-6 pt-6 pb-6 align-self-center">
                  <h1 className="secondfont mb-3 font-weight-bold">{firstCourse.name}</h1>
                  <ReactMarkdown source={decodeURIComponent(firstCourse.description).substring(0, 120)}
                                 className="mb-3" />
                  <span>
                    <a href={``} className="btn btn-white">
                      {(firstCourse.price / 100).toFixed(2)} {shop.currency}
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
                    <ReactMarkdown source={decodeURIComponent(course.description).substring(0, 200)} />
                    <div className="card-text text-muted small">
                      {shop.name}
                    </div>
                    <small className="text-muted">
                      <span
                        className={"text-danger"}>{course.price === 0 ? "Free" : `${(course.price / 100).toFixed(2)} ${shop.currency}`}</span> &middot; {course.createdAt} &middot; {course.digitalItems.length} topics
                    </small>
                  </div>
                  <img height="120" src={course.fullImages.length > 0 ? course.fullImages[0] : ""} alt={course.name} />
                </div>
              );
            })}
          </div>
        </div>

        <a href={``} className="btn btn-primary mt-3">
          Load More
        </a>
      </div>
    </>
  );
};

export const getStaticProps = async () => {
  let sort = {
    by: "CreatedAt",
    direction: "Desc"
  };
  const coursesResp = await Shopemaa.Api().list_products_with_override_sort(sort, 1, 100);
  const courses = coursesResp.data.data.products;
  return {
    props: {
      courses
    },
    revalidate: 1
  };
};

export default Courses;
