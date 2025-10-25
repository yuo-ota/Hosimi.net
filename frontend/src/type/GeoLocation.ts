export type Geolocation = {
	latitude: number;
	longitude: number;
};

export const isGeolocation = (data: any) => {
	return (
		data !== null &&
		typeof data === "object" &&
		("latitude" in data) &&
		("longitude" in data) &&
		typeof data.latitude === "number" &&
		typeof data.longitude === "number"
	);
}