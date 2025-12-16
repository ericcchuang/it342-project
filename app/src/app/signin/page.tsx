"use client";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const SigninForm = () => {
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3001/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, password }),
        credentials: "include",
      });

      if (res.ok) {
        window.location.href = callbackUrl;
      } else {
        const data = await res.json();
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Is the server running?");
    }
  };

  return (
    <div className="bg-primary bg-opacity-5 dark:bg-dark mx-auto max-w-[500px] rounded-md px-6 py-10 sm:p-[60px]">
      <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
        Sign in to your account
      </h3>

      <form onSubmit={handleSignIn}>
        <div className="mb-8">
          <label className="text-dark mb-3 block text-sm font-medium dark:text-white">
            Username
          </label>
          <input
            type="text"
            value={userid}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your username"
            className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base transition-all duration-300 outline-none dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
          />
        </div>
        <div className="mb-8">
          <label className="text-dark mb-3 block text-sm font-medium dark:text-white">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base transition-all duration-300 outline-none dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
          />
        </div>

        {error && <p className="mb-4 text-center text-red-500">{error}</p>}

        <div className="mb-6">
          <button className="shadow-submit dark:shadow-submit-dark bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-sm px-9 py-4 text-base font-medium text-white duration-300">
            Sign in
          </button>
        </div>
      </form>

      <p className="text-body-color text-center text-base font-medium">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

const SigninPage = () => {
  return (
    <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <Suspense fallback={<div>Loading...</div>}>
              <SigninForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SigninPage;
