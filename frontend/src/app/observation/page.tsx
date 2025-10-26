"use client";

import { Suspense, lazy, useState } from "react";
import BackPageAnimation from "./BackPageAnimation";

const Observation = lazy(() => import("@/features/Observation/Observation"));

export default function ObservationPage() {
  const [phase, setPhase] = useState<"idle" | "transitioning">("idle");

  return (
    <>
      {phase == "transitioning" && <BackPageAnimation />}
      {phase =="idle" && (
        <div className="w-dvw h-dvh flex justify-center bg-[var(--midnight-col)]">
          <Suspense fallback={<div className="text-foreground">読み込み中...</div>}>
            <Observation setPhase={setPhase} />
          </Suspense>
      </div>
      )}
    </>
  );
}
