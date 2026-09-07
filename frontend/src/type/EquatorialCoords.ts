export type EquatorialCoords = {
	declination: number;
	rightAscension: number;
};

export const isEquatorialCoords = (data: unknown): data is EquatorialCoords => {
	return (
		data !== null &&
		typeof data === "object" &&
		("declination" in data) &&
		("rightAscension" in data) &&
		typeof data.declination === "number" &&
		typeof data.rightAscension === "number"
	);
}
