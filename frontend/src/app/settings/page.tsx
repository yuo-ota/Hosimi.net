import Headline from "@/components/Headline";
import Setting from "@/features/Settings/Setting";

export default function SettingPage() {
  return (
    <>
      <div className="overflow-y-scroll w-dvw h-dvh flex justify-center bg-gradient-to-t from-[var(--midnight-col)] to-[var(--galaxy-col)]">
        <div className="flex flex-col w-17/20">
          <Headline
            preferSmall={false}
            title="設定"
            description=""
            className="mt-10 lg:mt-30 mb-10 lg:mb-20"
          />
          <Setting />
        </div>
      </div>
    </>
  );
}
