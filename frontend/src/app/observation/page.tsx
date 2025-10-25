import { Suspense, lazy } from "react";

const Observation = lazy(() => import("@/features/Observation/Observation"));

export default function ObservationPage() {
  return (
    <>
      <div className="w-dvw h-dvh flex justify-center bg-[var(--midnight-col)]">
        <Suspense fallback={<div className="text-foreground">読み込み中...</div>}>
          <Observation />
        </Suspense>
      </div>
    </>
  );
}
