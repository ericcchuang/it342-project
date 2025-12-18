import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/courses";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Development Courses",
  description: "Helpful links to start your web development journey.",
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Courses"
        description="Here are some links that will help you further your web development journey!"
      />
      
      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center text-center">
            <div className="w-full px-4 lg:w-8/12">
              <div className="mb-12">
                <h3 className="mb-4 text-2xl font-bold text-black dark:text-white">HTML Courses</h3>
                <p className="text-base font-medium leading-relaxed text-body-color">
                  Master the structure of the web. 
                  <a href="https://www.w3schools.com/html/default.asp" className="ml-2 text-primary hover:underline">
                    Get started with HTML →
                  </a>
                </p>
              </div>
              <div className="mb-12">
                <h3 className="mb-4 text-2xl font-bold text-black dark:text-white">CSS Courses</h3>
                <p className="text-base font-medium leading-relaxed text-body-color">
                  Learn how to style and design beautiful websites.
                  <a href="https://www.w3schools.com/css/default.asp" className="ml-2 text-primary hover:underline">
                    Get started with CSS →
                  </a>
                </p>
              </div>
              <div className="mb-12">
                <h3 className="mb-4 text-2xl font-bold text-black dark:text-white">Javascript Courses</h3>
                <p className="text-base font-medium leading-relaxed text-body-color">
                  Add interactivity and logic to your projects.
                  <a href="https://www.w3schools.com/js/default.asp" className="ml-2 text-primary hover:underline">
                    Get started with Javascript →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
};

export default ContactPage;