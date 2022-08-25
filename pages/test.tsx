import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import Link from "next/link";
import AccessToken from "@/components/accessToken";
import GithubLogin from "@/components/auth/github-login";

// export const getServerSideProps: GetServerSideProps = async () => {};

const Page = (props) => {
  useEffect(() => {
    (async function () {
      let res = await fetch("/api/db/abi");
      let data = await res.json();
    })();
  }, []);
  return (
    <main className="my-4 py-8">
      <AccessToken />
      <GithubLogin />
    </main>
  );
};

export default Page;
