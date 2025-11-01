export type StarDetailInfo = {
	starName: string;
    category: string;
    distance: string | null;
};

export const isStarDetailInfo = (data: unknown) => {
	return (
		data !== null &&
		typeof data === "object" &&
		("starName" in data) &&
		("category" in data) &&
		("distance" in data) &&
		typeof data.starName === "string" &&
		typeof data.category === "string" &&
		(typeof data.distance === "number" || data === null)
	);
}
