// 星座線ボタンを押すたびに、非表示 -> 線のみ -> 線+名前 -> 非表示 ... と巡回させる
export type ConstellationDisplayMode = "none" | "lines" | "linesAndNames";

const CONSTELLATION_DISPLAY_MODES: ConstellationDisplayMode[] = ["none", "lines", "linesAndNames"];

export const nextConstellationDisplayMode = (
  mode: ConstellationDisplayMode
): ConstellationDisplayMode => {
  const nextIndex = (CONSTELLATION_DISPLAY_MODES.indexOf(mode) + 1) % CONSTELLATION_DISPLAY_MODES.length;
  return CONSTELLATION_DISPLAY_MODES[nextIndex];
};
