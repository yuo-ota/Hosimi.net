import { isAPIError } from "@/type/APIError";
import { isStarDataArray } from "@/type/StarData";
import { isStarDetailInfo } from "@/type/StarDetailInfo";
const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;

// 取得する星の視等級の範囲。
// 実際に返る星はDBのカタログ(肉眼限界の6.5等 + 星座線の構成星)で決まるため、
// ここでは取りこぼしが起きないよう十分に広い範囲を指定する。
// 下限は最も明るいシリウス(-1.46等)、上限は最も暗い星座線構成星である
// ミラ(6.53等)を含められる値にしている。
const MIN_V_MAG = -2.0;
const MAX_V_MAG = 7.0;

export const getStarList = async () => {
    try {
        const response = await fetch(`${API_ORIGIN}/api/stars?minVMag=${MIN_V_MAG}&maxVMag=${MAX_V_MAG}`);
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