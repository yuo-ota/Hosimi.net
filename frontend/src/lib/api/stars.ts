import { isAPIError } from "@/type/APIError";
import { isStarDataArray } from "@/type/StarData";
import { isStarDetailInfo } from "@/type/StarDetailInfo";
const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;

export const getStarList = async (minVMag: number, maxVmag: number) => {
    try {
        const response = await fetch(`${API_ORIGIN}/api/stars?minVMag=${minVMag}&maxVMag=${maxVmag}`);
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
    } catch (error: any) {
        // fetch失敗や予期せぬ例外
        return { success: false, error: error.message ?? "予期せぬエラーが発生しました。" };
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
    } catch (error: any) {
        // fetch失敗や予期せぬ例外
        return { success: false, error: error.message ?? "予期せぬエラーが発生しました。" };
    }
}