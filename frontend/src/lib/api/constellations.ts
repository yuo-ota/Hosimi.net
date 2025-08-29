import { isAPIError } from "@/type/APIError";
import { isConstellationArray } from "@/type/ConstellationData";
const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;

export const getConstellations = async () => {
    try {
    const response = await fetch(`${API_ORIGIN}/api/constellations`);
    const data = await response.json();

    if (response.ok) {
        if (!isConstellationArray(data)) {
            throw new Error("不正な形式が返ってきました。");
        }
        return { success: true, constellationsData: data };
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
