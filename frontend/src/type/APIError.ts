export type APIError = {
	error: string;
};

export const isAPIError = (data: unknown): data is APIError => {
	return (
		data !== null &&
		typeof data === "object" &&
		("error" in data) &&
		typeof data.error == "string"
	);
}
