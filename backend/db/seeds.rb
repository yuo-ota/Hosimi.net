# 恒星・星座・星座線の初期データを投入する。
#
# データファイルは db/data 配下に置かれている。
#   star_catalog.tsv        SIMBAD TAP から生成した恒星カタログ (V<=6.5 + 星座線構成星)
#   constellations.tsv      88星座の IAU略号 / 学名 / 和名
#   constellation_lines.tsv さくら式星座線定義データ (CC0)
#
# 生成手順と選定の経緯は docs/constellation-lines-dataset-selection.md を参照。
#
# このファイルは Docker コンテナの起動毎に実行されるため、
# 冪等かつ、投入済みなら短時間で終了するように書くこと。

DATA_DIR = Rails.root.join("db", "data")

# さくら式のデータには 88 星座に加えて以下のグループが含まれるが、
# constellations テーブルに対応する行が無いため投入対象から除外する。
#   Arg ... アルゴ座 (Car / Vel / Pup / Pyx を結合したもの)
#   OeS ... へびつかい座とへび座を結合したもの
EXCLUDED_GROUPS = %w[Arg OeS].freeze

# 一度の upsert_all で送る行数。
# PostgreSQL の1文あたりのバインドパラメータ上限(65535)に達しないよう分割する。
BATCH_SIZE = 1000

# TSV を読み込んで各行を配列として返す。
def read_tsv(path, skip_header: false)
  rows = File.readlines(path, chomp: true).reject(&:empty?).map { |line| line.split("\t") }
  skip_header ? rows.drop(1) : rows
end

# 行を分割しながら upsert する。
def upsert_in_batches(model, rows, unique_by:)
  rows.each_slice(BATCH_SIZE) { |batch| model.upsert_all(batch, unique_by: unique_by) }
end

now = Time.current

# ---------------------------------------------------------------------------
# 恒星
# ---------------------------------------------------------------------------
star_rows = read_tsv(DATA_DIR.join("star_catalog.tsv"), skip_header: true).map do |hip, simbad_id, ra, dec, v_mag|
  {
    hip: hip.to_i,
    simbad_id: simbad_id,
    right_ascension: ra,
    declination: dec,
    v_mag: v_mag.to_f,
    created_at: now,
    updated_at: now
  }
end

# HIP を持つ星の件数が一致していれば投入済みとみなす。
# (星団や銀河など HIP を持たない天体は対象外なので件数に含めない)
if Star.where.not(hip: nil).count == star_rows.size
  puts "Stars: 投入済みのためスキップしました (#{star_rows.size}件)"
else
  upsert_in_batches(Star, star_rows, unique_by: :simbad_id)
  puts "Stars: #{star_rows.size}件を投入しました"
end

# ---------------------------------------------------------------------------
# 星座
# ---------------------------------------------------------------------------
constellation_rows = read_tsv(DATA_DIR.join("constellations.tsv"), skip_header: true).map do |abbreviation, eng, jpn|
  {
    abbreviation: abbreviation,
    constellation_name_eng: eng,
    constellation_name_jpn: jpn,
    created_at: now,
    updated_at: now
  }
end

# 学名を一意キーとして更新する。
# 既存行には略号が入っていないため、投入済み判定は略号の有無で行う。
if Constellation.where.not(abbreviation: nil).count == constellation_rows.size
  puts "Constellations: 投入済みのためスキップしました (#{constellation_rows.size}件)"
else
  upsert_in_batches(Constellation, constellation_rows, unique_by: :constellation_name_eng)
  puts "Constellations: #{constellation_rows.size}件を投入しました"
end

# ---------------------------------------------------------------------------
# 星座線
# ---------------------------------------------------------------------------
# 自動採番の id を直接埋め込むと、カタログの内容が変わった際に
# 無関係な星を指してしまう。必ず HIP 番号と略号から解決する。
constellation_ids = Constellation.pluck(:abbreviation, :id).to_h
star_ids = Star.where.not(hip: nil).pluck(:hip, :id).to_h

line_rows = []
unresolved = []

read_tsv(DATA_DIR.join("constellation_lines.tsv")).each do |abbreviation, start_hip, end_hip|
  next if EXCLUDED_GROUPS.include?(abbreviation)

  constellation_id = constellation_ids[abbreviation]
  start_star_id = star_ids[start_hip.to_i]
  end_star_id = star_ids[end_hip.to_i]

  if constellation_id.nil? || start_star_id.nil? || end_star_id.nil?
    unresolved << [ abbreviation, start_hip, end_hip ]
    next
  end

  line_rows << {
    constellation_id: constellation_id,
    start_star_id: start_star_id,
    end_star_id: end_star_id,
    created_at: now,
    updated_at: now
  }
end

if unresolved.any?
  # 端点が解決できない線は ConstellationView 側で無言で捨てられてしまうため、
  # ここで必ず可視化しておく。
  warn "ConstellationLines: #{unresolved.size}本の線を解決できませんでした"
  unresolved.each { |abbreviation, s, e| warn "  #{abbreviation}\tHIP #{s}\tHIP #{e}" }
end

if ConstellationLine.count == line_rows.size
  puts "ConstellationLines: 投入済みのためスキップしました (#{line_rows.size}件)"
else
  upsert_in_batches(ConstellationLine, line_rows, unique_by: :index_constellation_lines_uniqueness)
  puts "ConstellationLines: #{line_rows.size}件を投入しました"
end
