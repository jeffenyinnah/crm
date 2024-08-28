import { Button } from "@/components/ui/button";
import { SignedOut, SignIn, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-row items-center justify-between p-24">
      <div className="ml-8 text-2xl">
        <h2>Welcome to Aplo - CRM</h2>
      </div>
      <div className="flex flex-row justify-between gap-3 px-5">
        <SignedOut>
          <Button>
            <SignInButton />
          </Button>
        </SignedOut>

        <SignInButton>
          <UserButton />
        </SignInButton>
        <Button asChild variant="ghost" className="border border-blue-700">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    </main>
  );
}
