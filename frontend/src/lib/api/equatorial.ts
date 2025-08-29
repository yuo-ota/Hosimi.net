import { isAPIError } from "@/type/APIError";
import { isEquatorialCoords } from "@/type/EquatorialCoords";
const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;

export const getEquatorialCoords = async (latitude: number, longitude: number) => {
    try {
    const response = await fetch(`${API_ORIGIN}/api/equatorialCoords/${latitude}/${longitude}`);
    const data = await response.json();

    if (response.ok) {
        if (!isEquatorialCoords(data)) {
            throw new Error("不正な形式が返ってきました。");
        }
        return { success: true, equatorialCoordsData: data };
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
