export type GeoLocation = {
	latitude: number;
	longitude: number;
};

export const isGeoLocation = (data: any) => {
	return (
		data !== null &&
		typeof data === "object" &&
		("latitude" in data) &&
		("longitude" in data) &&
		typeof data.latitude === "number" &&
		typeof data.longitude === "number"
	);
}
