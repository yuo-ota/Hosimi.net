# 星座線データセット 選定記録

作成日: 2026-09-07 / 状態: **承認済み（さくら式を採用）**

## 1. 背景

`constellation_lines` テーブルは存在するが seed が未投入（[backend/db/seeds.rb](../backend/db/seeds.rb) 内でコメントアウト）。
全88星座の星座線を投入したい。手元の星系カタログ `backend/simbad.txt` を基礎データとする。

## 2. 受け入れ基準

| # | 要件 | 理由 |
|---|---|---|
| R1 | **恒星IDで線を定義**していること（座標ペアではない） | スキーマが `constellation_lines(start_star_id, end_star_id)` → `stars.id` の FK。座標だと最近傍マッチングが必要になり誤接続のリスク |
| R2 | ライセンスが **CC0 / パブリックドメイン相当** | 本リポジトリに LICENSE ファイルが無く、コピーレフト汚染を避けたい |
| R3 | **全88星座**をカバー | 要件として明示 |
| R4 | 一般的、または日本で一般的な線形 | 見慣れた形であること |
| R5 | 機械可読・再配布可能 | seed に取り込んでリポジトリに含める |

## 3. 候補比較

| 項目 | **さくら式星座線定義データ** | Stellarium `constellationship.fab` | d3-celestial `constellations.lines.json` |
|---|---|---|---|
| ライセンス | **CC0** ✅ | **GPL-2.0** ❌ | BSD-3-Clause ✅ |
| 星の識別子 | **HIP番号ペア** ✅ | HIP番号ペア ✅ | **座標(GeoJSON)** ❌ |
| 星座カバー | **88 + 2**（OeS, Arg）✅ | 88 ✅ | 88 ✅ |
| 由来 | 作者による独自定義 | Stellarium 標準（modern） | IAU ページ由来 + 作者改変 |
| サイズ / 形式 | 5.49 KB / TSV（3列: 星座略号, HIP1, HIP2） | .fab 独自形式 | JSON |
| 入手 | BOOTH（¥0） | GitHub | GitHub |
| R1 | ✅ | ✅ | ❌ |
| R2 | ✅ | ❌ | ✅ |

### 各候補の評価

**さくら式星座線定義データ**（[BOOTH](https://booth.pm/ja/items/4781014)）
- **CC0** かつ **HIP番号ペア**。R1・R2 を同時に満たす唯一の候補。
- 形式が `Cru 61084 60718` の3列TSVで、seed への変換が最も単純。
- 日本の作者による定義のため R4（日本で一般的）に合致しやすい。
- 88星座に加え OeS（へびつかい+へび）と Arg（アルゴ座）の2つを同梱。**この2つは本プロジェクトの `constellations` テーブル（88件）に存在しないため、投入対象から除外する。**

**Stellarium**（[skycultures/modern_st](https://github.com/Stellarium/stellarium/tree/master/skycultures/modern_st)）
- 最も広く使われており線形の信頼性は高い。HIP番号ベースで R1 は満たす。
- しかし **GPL-2.0**。データファイルを同梱するとリポジトリ全体へのコピーレフト波及を検討する必要があり、R2（CC0など軽いものを優先）の方針と衝突する。**この一点で不採用。**

**d3-celestial**（[ofrohn/d3-celestial](https://github.com/ofrohn/d3-celestial)）
- ライセンスは BSD-3-Clause で問題なし。
- ただし線が **HIP番号ではなく座標ペア（GeoJSON）** で定義されている。既存スキーマに載せるには座標→最寄りの星への逆引きが必要で、暗い星が密集する領域で誤接続が起きる。**R1 を満たさないため不採用。**

## 4. 結論

> ### 採用: さくら式星座線定義データ（CC0）

R1・R2 を同時に満たすのはこの1件のみ。Stellarium はライセンス、d3-celestial は識別子形式で脱落。

## 5. 副次的発見: SIMBAD TAP で `simbad.txt` を全面再生成できる

当初案は「`simbad.txt` に暗い星を手で追記し、別途 HIP 対応表を用意する」だった。
しかし **SIMBAD TAP**（ADQL）で **必要な情報が1クエリで全て揃う**ことを実機検証で確認した。

```sql
SELECT b.main_id, i.id AS hip_id, b.ra, b.dec, f.V AS vmag
FROM basic AS b
JOIN ident AS i     ON i.oidref = b.oid
JOIN allfluxes AS f ON f.oidref = b.oid
WHERE i.id LIKE 'HIP %' AND f.V <= 6.5
```

実行結果（抜粋）:

```
main_id,hip_id,ra,dec,vmag
"* alf CMa","HIP 32349",101.28715533333335,-16.71611586111111,-1.46
"* alf Car","HIP 30438",95.98795782918306,-52.69566138386201,-0.74
"* alf Boo","HIP 69673",213.915300294925,19.1824091615312,-0.05
```

これにより:

1. **`main_id` が既存 `simbad.txt` の識別子と同形式**（`* alf CMa`）→ `find_or_create_by!(simbad_id:)` で既存行にそのままマッチし、**既存の `stars.id` を壊さない**
2. **HIP番号が同時に取れる** → 別途クロスウォークを作る必要なし
3. **RA/Dec が10進度で返る** → `UnitConverter` による時角/度分秒パースが不要になり seed が単純化（※ `UnitConverter` は `horizon_API_manager` でも使用中なので削除はしない）
4. **`AccessManager` の 30req/min 制限を回避** — 実行時スクレイピングではなく、ビルド時に1回叩いて生成物をコミットする

### 等級別の件数（TAP実測、HIP保有星のみ）

| V等級上限 | 件数 | JSON概算(生) | gzip後概算 |
|---|---|---|---|
| 5.0（現状相当） | 1,563 | 約 140 KB | 約 25 KB |
| 6.0 | 4,805 | 約 430 KB | 約 70 KB |
| **6.5** | **8,434** | **約 760 KB** | **約 120 KB** |
| 7.0 | 14,683 | 約 1.3 MB | 約 200 KB |

## 6. 等級上限の提案: **6.5等**

- **6.5等は肉眼で見える限界等級**。「肉眼で見る星空」というアプリの前提と一致し、恣意的でない根拠がある。
- 描画コストは問題にならない。[StarField.tsx](../frontend/src/features/Observation/components/StarField.tsx) は**単一の `THREE.Points` + 1つの `BufferGeometry`** で、14,000点でもGPU的には誤差の範囲。カメラの `far` は 1000 で、最も暗い星の描画半径（約48）にも余裕がある。
- **ボトルネックは描画ではなく転送量と `localStorage`**。ただし [nginx/default.conf](../nginx/default.conf) は **gzip が無効**（nginx のデフォルトはoff）。`gzip on` を入れるだけで 760KB → 約120KB になり、ここが最大の改善余地。
- 7.0 は件数が1.7倍になる一方、6.5〜7.0等の星は肉眼では見えずアプリの前提から外れるため、費用対効果が低い。

→ **表示上限は 6.5等。ただし採用データセットの最暗星が 6.5等を超える場合はその星だけ個別に追加**し、線が欠けないようにする（TSV取得後に TAP で実測して確定する）。

### 表示用と線用でデータを分けるか（Q2への回答）: **分けない**

分割しても取得件数はほぼ変わらず（線に使われる星の大半は明るい星で、表示集合に含まれる）、**利得よりスキーマと同期の複雑さが上回る**。等級による絞り込みは既に `vMagRanges` でクライアント側で行っているため、単一データセットで足りる。

## 7. 決定事項と残タスク

| # | 項目 | 決定 |
|---|---|---|
| 1 | 採用データセット | **さくら式星座線定義データ（CC0）** |
| 2 | 表示等級の上限 | **6.5等**（最暗星の実測後に確定） |
| 3 | 表示用/線用のデータ分割 | **分割しない** |
| 4 | 星カタログの生成方法 | **SIMBAD TAP で `simbad.txt` を全面再生成**（HIP列を追加） |
| 5 | 南天星座の扱い | **先に `y > 0` を撤廃**してから星座線を投入（→ PR #41） |
| 6 | TSVの入手 | **リポジトリオーナーが BOOTH から手動DLして配置** |

### 残タスク

- [ ] `ConstellationLines.tsv` を手動DLして `backend/db/data/` に配置（**オーナー作業**）
- [ ] 参照されている全HIPの V等級を TAP で実測し、6.5等で足りるか確認。超える星は個別に追加
- [ ] `stars` テーブルに `hip` カラム追加（unique index 付き）＋ 既存行のバックフィル
- [ ] TAP で星カタログを再生成し `simbad.txt` を差し替え
- [ ] `constellation_lines` に `(constellation_id, start_star_id, end_star_id)` の unique index を追加
- [ ] 星座線 seed を実装（**HIP経由で `stars.id` を解決。生IDの埋め込みは禁止**）
- [ ] seed のスキップ条件（件数チェック）を追加
- [ ] HIP突合に失敗した星を別リストに書き出し、後で手当て
- [ ] `localStorage` にスキーマ版を持たせてキャッシュを破棄できるようにする
- [ ] nginx で `gzip on` を有効化

### 対象外とするもの

- さくら式に含まれる **OeS（へびつかい+へび）と Arg（アルゴ座）** の2グループは、`constellations` テーブル（88件）に存在しないため投入しない。

## 8. 別件で発見した既存の不整合

星座線とは独立だが、88星座投入の前提を崩すため記録する。

### 8-1. 観測地がスカイビューに反映されていない
- `GET /api/equatorialCoords/...` は実装済みだが、**フロントエンドから一度も呼ばれていない**（`src/lib/api/equatorial.ts` を参照しているファイルが存在しない）。
- `UserPositionContext` も `setPosition` は呼ばれるが **`position` を読む箇所が無い**。
- つまり**位置設定画面の入力が天球の向きに一切影響していない**。

### 8-2. 南天の星が描画されない
- [StarField.tsx:84](../frontend/src/features/Observation/components/StarField.tsx) の `if (y > 0)` は `y = radius * sin(dec)` なので、実質 **赤緯 dec > 0（北天）の星のみ描画**。
- 一方 [ConstellationView.tsx](../frontend/src/features/Observation/components/ConstellationView.tsx) には同等のフィルタが**無い**。
- → **全88星座を投入すると、南天星座（みなみじゅうじ座など）は「星が無いのに線だけが浮く」表示になる。**

### 対応状況

| 項目 | 状態 |
|---|---|
| 8-1 観測地が反映されていない | **未対応**（別課題として残す） |
| 8-2 南天の星が描画されない | **PR #41 で対応**（`y > 0` を撤廃） |

### 8-3. seed が実行できずコンテナが起動しない（修正済み）

調査中に発見。`constellations.each` のループが欠落しており `db:seed` が `NameError` で停止していた。
Dockerfile の CMD が `db:seed && thrust rails server` と `&&` 連結のため、**サーバーが起動しない**状態だった。
→ **PR #40 で修正**。

### 8-4. シリウスが表示されない（修正済み）

星取得APIの視等級下限が `-1.0` で、-1.46等のシリウスが範囲外だった。
→ **PR #39 で修正済み（マージ済み）**。
