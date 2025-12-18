import SingleBlog from "@/components/search/SingleBlog";
import blogData from "@/components/search/blogData";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Web Development Insights",
  description: "Explore our latest articles and updates on web development.",
};

export default function BlogPage() {
  return (
    <>
      <Breadcrumb 
        pageName="Blog" 
        description="Check out our latest news, tips, and web development updates." 
      />

      <section className="pb-[120px] pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {blogData.map((blog: any) => (
              <div
                key={blog.id}
                className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
              >
                <SingleBlog blog={blog} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}