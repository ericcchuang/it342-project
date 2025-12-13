import Breadcrumb from "@/components/Common/Breadcrumb";



import Contact from "@/components/courses";





import { Metadata } from "next";





export const metadata: Metadata = {


  title: "Web Development Courses",


  description: "This is Contact Page for Startup Nextjs Template",


  // other metadata


};





const ContactPage = () => {


  return (


    <>


      <Breadcrumb


        pageName="Courses"


        description="Here are some links that will help you further your web development jouney!"


      />


      <div> HTML Courses: 


        <a href="https://www.w3schools.com/html/default.asp">Get started with HTML</a>


      </div>


      <div>CSS Courses:


        <a href="https://www.w3schools.com/css/default.asp">Get started with CSS</a>


      </div>


      <div>Javascript Courses:


        <a href="https://www.w3schools.com/js/default.asp">Get started with Javascript</a>


      </div>


      <Contact />


    </>


  );


};





export default ContactPage;