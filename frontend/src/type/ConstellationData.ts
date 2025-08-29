export type Constellation = {
	constellationName: string;
	constellationLines: ConstellationLine[];
};

export type ConstellationLine = {
	startStarId: string;
	endStarId: string;
}

export const isConstellationArray = (data: any) => {
	return Array.isArray(data) && data.every((item: any) => isConstellation(item));
}

const isConstellation = (data: any) => {
	return (
		data !== null &&
		typeof data === "object" &&
		("constellationName" in data) &&
		("constellationLines" in data) &&
		typeof data.constellationName === "string" &&
		Array.isArray(data.constellationLines) &&
		data.constellationLines.every((item: any) => isConstellationLine(item))
	);
}

const isConstellationLine = (data: any) => {
	return (
		data !== null &&
		typeof data === "object" &&
		("startStarId" in data) &&
		("endStarId" in data) &&
		typeof data.startStarId === "string" &&
		typeof data.endStarId === "string"

	);
}