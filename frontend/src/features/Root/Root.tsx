"use client";

import DecorateBorder from "@/components/DecorateBorder";
import { useTransitionNavigation } from "@/utils/trantision";
import Question from "./components/Question";

const Root = () => {
	const transition = useTransitionNavigation();

  const handleClick = () => {
    transition("/location-settings", "top_to_bottom");
  }
	
	return (
		<>
			<div className="w-full lg:max-w-[800px] text-md lg:text-2xl break-keep wrap-break-word">
				<div className="mb-5 lg:mb-10 flex flex-col gap-5">
					<Question questionText="今見えている星って何座なんだろう？" isOdd={false} />
					<Question questionText="昼にはどんな星が空に隠れているだろう？" isOdd={true} />
					<Question questionText="今地球の裏では、どんな星空なのかな？" isOdd={false} />
				</div>
				そんな知的好奇心をスマホ1つで満たすことができるアプリになります。<br />
				<span className="underline decoration-accent text-xl lg:text-3xl my-3 inline-block break-all">星座早見表もコンパスも必要なし。</span><br />
				位置を入力して
				<span className="underline decoration-accent text-xl lg:text-3xl my-3 inline-block break-all">
					スマホを空に向ければ
				</span>
				星の名前も星の詳細な見た目もわかります。
			</div>
			<DecorateBorder isBorderPutX={true} className="w-full h-15 lg:h-20 bg-foreground/30 lg:max-w-[300px] mt-10 lg:mt-20 mb-10 lg:mb-30">
				<button onClick={handleClick} className="w-full h-full hover:bg-background/20">
					<span className="text-lg lg:text-2xl align-middle">天体観測へ行く</span>
				</button>
			</DecorateBorder>
		</>
	);
};

export default Root;