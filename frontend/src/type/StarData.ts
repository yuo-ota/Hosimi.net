export type StarData = {
	starId: string;
	declination: number;
	rightAscension: number;
	vMag: number;
};

export const isStarDataArray = (data: unknown) => {
	return Array.isArray(data) && data.every(item => isStarData(item));
}

const isStarData = (data: unknown) => {
	return (
		data !== null &&
		typeof data === "object" &&
		("starId" in data) &&
		("declination" in data) &&
		("rightAscension" in data) &&
		("vMag" in data) &&
		typeof data.starId === "string" &&
		typeof data.declination === "number" &&
		typeof data.rightAscension === "number" &&
		typeof data.vMag === "number"
	);
}