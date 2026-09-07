import { isAPIError } from "@/type/APIError";
import { isStarDataArray } from "@/type/StarData";
import { isStarDetailInfo } from "@/type/StarDetailInfo";
import { FETCH_V_MAG_MIN, FETCH_V_MAG_MAX } from "@/config/starMagnitude";
const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;

export const getStarList = async () => {
    try {
        const response = await fetch(`${API_ORIGIN}/api/stars?minVMag=${FETCH_V_MAG_MIN}&maxVMag=${FETCH_V_MAG_MAX}`);
        const data = await response.json();
        if (response.ok) {
            if (!isStarDataArray(data)) {
                throw new Error("不正な形式が返ってきました。");
            }
            return { success: true, starListData: data };
        } else {
            if (!isAPIError(data)) {
                throw new Error("不正なエラーが返ってきました。");
            }
            return { success: false, error: `${response.status}: ${data.error}` };
        }
    } catch (error: unknown) {
        // fetch失敗や予期せぬ例外
        return { success: false, error: (error as Error).message ?? "予期せぬエラーが発生しました。" };
    }
};

export const getStarDetailInfo = async (starId: string) => {
    try {
        const response = await fetch(`${API_ORIGIN}/api/stars/${starId}`);
        const data = await response.json();

        if (response.ok) {
            if (!isStarDetailInfo(data)) {
                throw new Error("不正な形式が返ってきました。");
            }
            return { success: true, starDetailInfoData: data };
        } else {
            if (!isAPIError(data)) {
                throw new Error("不正なエラーが返ってきました。");
            }
            return { success: false, error: `${response.status}: ${data.error}` };
        }
    } catch (error: unknown) {
        // fetch失敗や予期せぬ例外
        return { success: false, error: (error as Error).message ?? "予期せぬエラーが発生しました。" };
    }
}