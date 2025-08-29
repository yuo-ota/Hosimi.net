"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/location-settings");
  }

  return (
    <div className="font-title grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <button className="w-64 h-15 bg-white rounded-full text-black" onClick={handleClick}>
        設定へ移動
      </button>
    </div>
  );
}
