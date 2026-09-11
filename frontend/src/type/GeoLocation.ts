export type GeoLocation = {
	latitude: number;
	longitude: number;
};

export const isGeoLocation = (data: unknown): data is GeoLocation => {
	return (
		data !== null &&
		typeof data === "object" &&
		("latitude" in data) &&
		("longitude" in data) &&
		typeof data.latitude === "number" &&
		typeof data.longitude === "number"
	);
}
