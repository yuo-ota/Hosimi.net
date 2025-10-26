import { isGeoLocation } from "@/type/GeoLocation";
import { isAPIError } from "@/type/APIError";
const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;


export const getCoordsByLocationName = async (location: string) => {
    try {
        const response = await fetch(`${API_ORIGIN}/api/geolocation/${location}`);
        const data = await response.json();

        if (response.ok) {
            if (!isGeoLocation(data)) {
                throw new Error("不正な形式が返ってきました。");
            }
            return { success: true, geolocationData: data };
        } else {
            if (!isAPIError(data)) {
                throw new Error("不正なエラーが返ってきました。");
            }
            return { success: false, error: `${response.status}: ${data.error}` };
        }
    } catch (error: any) {
        // fetch失敗や予期せぬ例外
        return { success: false, error: error.message ?? "予期せぬエラーが発生しました。" };
    }
};
