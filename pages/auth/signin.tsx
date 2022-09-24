import {
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
} from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn({ providers }) {
  const router = useRouter();
  return (
    <main className="flex justify-center items-center min-h-screen BG_Cross">
      <div className="p-4 border shadow-lg bg-white rounded-lg">
        <h1 className="text-4xl text-center">XABI</h1>
        <h2 className="text-xl text-center">Sign In</h2>
        <div className="my-4">
          {Object.values(providers).map((provider) => (
            <div key={provider["name"]}>
              <button
                className="text-blue-700 p-2 border border-blue-300 shadow-md hover:bg-blue-500 hover:text-white"
                onClick={() => {
                  signIn(provider["id"], {
                    callbackUrl: router.query.callbackUrl
                      ? String(router.query.callbackUrl)
                      : "/",
                  });
                }}
              >
                Sign in with {provider["name"]}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  return {
    props: {
      providers: await getProviders(),
      csrfToken: await getCsrfToken(context),
    },
  };
}
