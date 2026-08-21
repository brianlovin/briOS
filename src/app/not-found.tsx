import Link from "next/link";

import { PageTitle } from "@/components/Typography";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex max-w-xl flex-col items-center gap-4 leading-[1.6]">
          <PageTitle>404</PageTitle>
          <p className="text-secondary text-xl font-medium text-pretty">
            You have found yourself in quite a situation
          </p>
          <Link href="/" className="link-body">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
