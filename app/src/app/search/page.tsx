import Breadcrumb from "@/components/Common/Breadcrumb";
import SingleBlog from "@/components/search/SingleBlog";
import blogData from "@/components/search/blogData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search blogs, courses, and users",
};

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    type?: string; // all | blogs | courses | users
  }>;
};

type Course = {
  id: number;
  title: string;
  category: string;
  url: string;
  description: string;
};

type UserResult = {
  userid: string;
};

const courses: Course[] = [
  {
    id: 1,
    title: "HTML Course",
    category: "HTML",
    url: "https://www.w3schools.com/html/default.asp",
    description: "Basics of HTML structure, tags, and pages.",
  },
  {
    id: 2,
    title: "CSS Course",
    category: "CSS",
    url: "https://www.w3schools.com/css/default.asp",
    description: "Styling, layout, and responsive design basics.",
  },
  {
    id: 3,
    title: "JavaScript Course",
    category: "JavaScript",
    url: "https://www.w3schools.com/js/default.asp",
    description: "Core JavaScript concepts and DOM basics.",
  },
  {
    id: 4,
    title: "React Tutorial",
    category: "React",
    url: "https://www.w3schools.com/react/default.asp",
    description: "Components, props, state, and hooks intro.",
  },
  {
    id: 5,
    title: "SQL Tutorial",
    category: "SQL",
    url: "https://www.w3schools.com/sql/default.asp",
    description: "Queries, joins, and database basics.",
  },
];

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;

  const queryRaw = searchParams.q || "";
  const query = queryRaw.toLowerCase();

  const typeRaw = (searchParams.type || "all").toLowerCase();
  const type =
    typeRaw === "blogs" || typeRaw === "courses" || typeRaw === "users"
      ? typeRaw
      : "all";

  const filteredBlogs =
    query === ""
      ? blogData
      : blogData.filter((blog: any) =>
          String(blog.title || "")
            .toLowerCase()
            .includes(query),
        );

  const filteredCourses =
    query === ""
      ? courses
      : courses.filter((c) => {
          const text = (
            c.title +
            " " +
            c.category +
            " " +
            c.description
          ).toLowerCase();
          return text.includes(query);
        });

  const showBlogs = type === "all" || type === "blogs";
  const showCourses = type === "all" || type === "courses";
  const showUsers = type === "all" || type === "users";

  // Backend user search
  let userResults: UserResult[] = [];
  let userSearchError = "";

  if (showUsers && queryRaw.trim() !== "") {
    try {
      const apiBase = getApiBaseUrl();
      const url = `${apiBase}/api/search/users?q=${encodeURIComponent(queryRaw.trim())}`;

      const resp = await fetch(url, {
        cache: "no-store",
      });

      if (!resp.ok) {
        userSearchError = `User search failed (${resp.status})`;
      } else {
        const data = (await resp.json()) as { results?: UserResult[] };
        userResults = Array.isArray(data.results) ? data.results : [];
      }
    } catch (e: any) {
      userSearchError = "User search failed (network error)";
    }
  }

  const nothingFound =
    (showBlogs ? filteredBlogs.length === 0 : true) &&
    (showCourses ? filteredCourses.length === 0 : true) &&
    (showUsers
      ? queryRaw.trim() === ""
        ? false
        : userResults.length === 0
      : true);

  return (
    <>
      <Breadcrumb
        pageName="Search"
        description="Search blogs, courses, and users."
      />

      <section className="pt-[120px] pb-[120px]">
        <div className="container">
          <form
            method="GET"
            className="mb-10 flex flex-wrap items-center justify-center gap-3"
          >
            <input
              type="text"
              name="q"
              defaultValue={queryRaw}
              placeholder="Search blogs, courses, or users..."
              className="border-stroke focus:border-primary w-full max-w-md rounded-md border bg-transparent px-4 py-2 text-base outline-none"
            />

            <select
              name="type"
              defaultValue={type}
              className="border-stroke focus:border-primary rounded-md border bg-transparent px-3 py-2 text-base outline-none"
            >
              <option value="all">All</option>
              <option value="blogs">Blogs</option>
              <option value="courses">Courses</option>
              <option value="users">Users</option>
            </select>

            <button
              type="submit"
              className="bg-primary rounded-md px-4 py-2 text-sm text-white"
            >
              Search
            </button>
          </form>

          {showBlogs && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Blog results</h2>
                <span className="text-body-color text-sm">
                  {filteredBlogs.length} found
                </span>
              </div>

              <div className="-mx-4 flex flex-wrap justify-center">
                {filteredBlogs.map((blog: any) => (
                  <div
                    key={blog.id}
                    className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
                  >
                    <SingleBlog blog={blog} />
                  </div>
                ))}

                {filteredBlogs.length === 0 && (
                  <p className="text-body-color mt-2 text-center">
                    No blog results.
                  </p>
                )}
              </div>
            </>
          )}

          {showCourses && (
            <>
              <div className="mt-14 mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Course results</h2>
                <span className="text-body-color text-sm">
                  {filteredCourses.length} found
                </span>
              </div>

              <div className="-mx-4 flex flex-wrap justify-center">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
                  >
                    <div className="border-stroke rounded-md border p-6">
                      <h3 className="mb-2 text-lg font-semibold">
                        {course.title}
                      </h3>
                      <p className="text-body-color mb-2 text-xs">
                        {course.category}
                      </p>
                      <p className="text-body-color mb-4 text-sm">
                        {course.description}
                      </p>
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline"
                      >
                        Open course
                      </a>
                    </div>
                  </div>
                ))}

                {filteredCourses.length === 0 && (
                  <p className="text-body-color mt-2 text-center">
                    No course results.
                  </p>
                )}
              </div>
            </>
          )}

          {showUsers && (
            <>
              <div className="mt-14 mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">User results</h2>
                <span className="text-body-color text-sm">
                  {userResults.length} found
                </span>
              </div>

              {queryRaw.trim() === "" && (
                <p className="text-body-color mt-2 text-center">
                  Type a username to search users.
                </p>
              )}

              {queryRaw.trim() !== "" && userSearchError && (
                <p className="text-body-color mt-2 text-center">
                  {userSearchError}
                </p>
              )}

              {queryRaw.trim() !== "" && !userSearchError && (
                <div className="-mx-4 flex flex-wrap justify-center">
                  {userResults.map((u) => (
                    <div
                      key={u.userid}
                      className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
                    >
                      <div className="border-stroke rounded-md border p-6">
                        <h3 className="text-lg font-semibold">{u.userid}</h3>
                      </div>
                    </div>
                  ))}

                  {userResults.length === 0 && (
                    <p className="text-body-color mt-2 text-center">
                      No user results.
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {nothingFound && (
            <p className="text-body-color mt-10 text-center">
              No results found.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
