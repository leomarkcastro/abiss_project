import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ALLOWED_ROUTES = ["/auth/signin", "/"];

export function RouteGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      status === "unauthenticated" &&
      ALLOWED_ROUTES.indexOf(router.asPath) == -1
    )
      router.replace("/auth/signin");
  }, [status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (
    status === "unauthenticated" &&
    ALLOWED_ROUTES.indexOf(router.asPath) == -1
  ) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col justify-center items-center">
        <p>Access Denied</p>
        <Link href="/auth/signin">
          <a className="text-blue-500">Sign In</a>
        </Link>
      </div>
    );
  }

  return children;
}
