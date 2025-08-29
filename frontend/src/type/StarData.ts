export type StarData = {
	starId: string;
	declination: string;
	rightAscension: string;
	vMag: number;
};

export const isStarDataArray = (data: any) => {
	return Array.isArray(data) && data.every(item => isStarData(item));
}

const isStarData = (data: any) => {
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