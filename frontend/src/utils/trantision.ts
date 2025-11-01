"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useTransitionNavigation() {
  const router = useRouter();

  const transition = useCallback(
    async (newUrl: string, animationType: "top_to_bottom" | "bottom_to_top" | "bottom_to_top_ease_in" | "bottom_to_top_ease_out") => {
      if (!document.startViewTransition) {
        router.push(newUrl);
        return;
      }

      document.documentElement.dataset.transition = animationType;

      document.startViewTransition(async() => {
        await Promise.resolve(router.push(newUrl));
      });
    },
    [router]
  );

  return transition;
}