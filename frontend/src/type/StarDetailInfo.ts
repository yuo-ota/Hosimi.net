export type StarDetailInfo = {
	starName: string;
    category: string;
    distance: string | null;
};

export const isStarDetailInfo = (data: any) => {
	return (
		data !== null &&
		typeof data === "object" &&
		("starName" in data) &&
		("category" in data) &&
		("distance" in data) &&
		typeof data.starName === "number" &&
		typeof data.category === "number" &&
		(typeof data.distance === "number" || data === null)
	);
}
