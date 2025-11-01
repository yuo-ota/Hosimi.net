export type Constellation = {
	constellationName: string;
	constellationLines: ConstellationLine[];
};

export type ConstellationLine = {
	startStarId: string;
	endStarId: string;
}

export const isConstellationArray = (data: unknown) => {
	return Array.isArray(data) && data.every((item: unknown) => isConstellation(item));
}

const isConstellation = (data: unknown) => {
	return (
		data !== null &&
		typeof data === "object" &&
		("constellationName" in data) &&
		("constellationLines" in data) &&
		typeof data.constellationName === "string" &&
		Array.isArray(data.constellationLines) &&
		data.constellationLines.every((item: unknown) => isConstellationLine(item))
	);
}

const isConstellationLine = (data: unknown) => {
	return (
		data !== null &&
		typeof data === "object" &&
		("startStarId" in data) &&
		("endStarId" in data) &&
		typeof data.startStarId === "string" &&
		typeof data.endStarId === "string"

	);
}