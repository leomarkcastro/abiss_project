import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data } = useSession();
  return <div>Access Token: {data?.accessToken}</div>;
}
