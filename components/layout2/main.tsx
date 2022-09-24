import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

function Content({ children }) {
  return (
    <div className="">
      <Navbar />
      <div className="p-4">{children}</div>
    </div>
  );
}

const UNSTYLED_ROUTES = ["/auth"];

export default function Layout({ children }) {
  const [applyStyle, setApplyStyle] = useState(true);
  const router = useRouter();

  useEffect(() => {
    UNSTYLED_ROUTES.some((route) => {
      if (router.asPath.startsWith(route)) {
        setApplyStyle(false);
        return true;
      }
    });
  }, [router]);

  return (
    <>
      {applyStyle ? (
        <>
          <div className="flex">
            <div className="flex-1">
              <Sidebar />
            </div>
            <div className="flex-[6]">
              <Content>{children}</Content>
            </div>
          </div>
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
