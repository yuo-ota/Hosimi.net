type QuestionProps = {
	questionText: string;
	isOdd: boolean;
}

const Question = ({questionText, isOdd}: QuestionProps) => {
	return (
		<>
			<div
				className="max-w-full rounded-lg bg-foreground p-3 text-background break-all wrap-anywhere relative"
				style={{
					alignSelf: isOdd ? "self-start" : "self-end",
					marginLeft: isOdd ? "1rem" : "auto",
					marginRight: !isOdd ? "1rem" : "auto",
				}}
			>
				{questionText}
				<div
					className="absolute w-2 h-2 rounded-full bg-foreground -bottom-5"
					style={{
						bottom: -10,
						left: isOdd ? -8 : "auto",
						right: !isOdd ? -8 : "auto"
					}}
				/>
				<div
					className="absolute w-1 h-1 rounded-full bg-foreground -bottom-5"
					style={{
						bottom: -15,
						left: isOdd ? -15 : "auto",
						right: !isOdd ? -15 : "auto"
					}}
				/>
			</div>
		</>
	);
}

export default Question;