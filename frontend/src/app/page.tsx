import Headline from "@/components/Headline";
import Root from "@/features/Root/Root";

export default function HomePage() {

  return (
    <div className="w-dvw min-h-dvh flex justify-center bg-gradient-to-t from-[var(--noon-col)] to-[var(--sunset-col)]">
        <div className="flex justify-start flex-col items-center w-17/20">
          <Headline
            preferSmall={false}
            title="Astronomへようこそ"
            description="天体観測をさらに楽しく。<br>場所も時間も気にせずに空へ。"
            className="mt-10 lg:mt-30 mb-10 lg:mb-20"
          />
          <Root />
        </div>
    </div>
  );
}
