import { Suspense } from "react";
import UnlockClient from "@/components/UnlockClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnlockClient />
    </Suspense>
  );
}