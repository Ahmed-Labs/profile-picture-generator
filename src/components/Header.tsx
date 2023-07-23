import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./Button";
import { useBuyCredits } from "~/hooks/useBuyCredits";

export default function Header() {
  const session = useSession();
  const isLoggedIn = !!session.data;
  const { buyCredits } = useBuyCredits();

  return (
    <header className="container mx-auto flex h-16 items-center justify-between px-5 dark:bg-gray-800">
      <Link href="/" className="font-bold">
        PICME
      </Link>
      <ul>
        <li>
          <Link href="/generate">Generate</Link>
        </li>
      </ul>
      <div>
        <ul className="flex gap-2">
          {isLoggedIn && (
            <>
              <li>
                <Button
                  onClick={() => {
                    buyCredits().catch(console.error);
                  }}
                >
                  Buy Credits
                </Button>
              </li>
              <li>
                {" "}
                <Button
                  variant="secondary"
                  onClick={() => {
                    signOut().catch(console.error);
                  }}
                >
                  Logout
                </Button>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <li>
              {" "}
              <Button
                onClick={() => {
                  signIn().catch(console.error);
                }}
              >
                Login
              </Button>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
