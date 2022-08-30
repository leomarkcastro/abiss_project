import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const session = useSession();

  return (
    <div className="flex px-0 md:px-3 sticky top-0 z-10">
      <div className="flex-1 bg-white flex rounded-lg rounded-tl-none rounded-tr-none border shadow-md p-3">
        <div className="flex-1 flex gap-2 items-center">
          <p className="font-bold">X_ABI</p>
          <p className="text-xs">Hello, {session.data?.user.email}</p>
        </div>
        <div className="flex-1 flex items-center justify-end gap-3">
          <Link href="/">
            <a>Home</a>
          </Link>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      </div>
    </div>
  );
}
