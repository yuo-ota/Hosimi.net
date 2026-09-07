import { VMagRange } from "@/type/VMagRange";

// APIから取得する視等級の範囲。
// 実際に返る星はDBのカタログ(肉眼限界の6.5等 + 星座線の構成星)で決まるため、
// ここでは取りこぼしが起きないよう十分に広い範囲を指定する。
// 下限は最も明るいシリウス(-1.46等)、上限は最も暗い星座線構成星である
// ミラ(6.53等)を含められる値にしている。
export const FETCH_V_MAG_MIN = -2.0;
export const FETCH_V_MAG_MAX = 7.0;

// スライダーで選択できる表示範囲。取得範囲と揃えることで、
// 取得済みの星が「スライダーでは選べない」状態にならないようにする。
export const DISPLAY_V_MAG_MIN = FETCH_V_MAG_MIN;
export const DISPLAY_V_MAG_MAX = FETCH_V_MAG_MAX;

// 初期表示の等級範囲。
// 6.5等まで一度に出すと星が密集して星座を追いにくいため、既定では3等星までとする。
export const DEFAULT_V_MAG_RANGE: VMagRange = {
  min: DISPLAY_V_MAG_MIN,
  max: 3.0,
};
