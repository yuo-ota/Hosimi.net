require "test_helper"

# db/data 配下の seed 用データファイルの整合性を検証する。
#
# 星座線は端点となる星が両方カタログに存在しないと成立しないが、
# フロントエンド(ConstellationView)は端点が欠けた線を無言で捨てるため、
# データが壊れても画面上は「線が少し減る」だけで気づけない。
# ここで機械的に検証しておく。
class SeedDataTest < ActiveSupport::TestCase
  DATA_DIR = Rails.root.join("db", "data")

  # seeds.rb と同じく、対応する星座が無いグループは対象外とする。
  EXCLUDED_GROUPS = %w[Arg OeS].freeze

  def read_tsv(name, skip_header: false)
    rows = File.readlines(DATA_DIR.join(name), chomp: true)
               .reject(&:empty?)
               .map { |line| line.split("\t") }
    skip_header ? rows.drop(1) : rows
  end

  def stars
    @stars ||= read_tsv("star_catalog.tsv", skip_header: true)
  end

  def constellations
    @constellations ||= read_tsv("constellations.tsv", skip_header: true)
  end

  def lines
    @lines ||= read_tsv("constellation_lines.tsv").reject { |abbr, _, _| EXCLUDED_GROUPS.include?(abbr) }
  end

  test "恒星カタログの各行が5列である" do
    assert stars.any?
    assert_empty stars.reject { |row| row.size == 5 }
  end

  test "恒星カタログのHIP番号が一意である" do
    hips = stars.map { |hip, *| hip }
    assert_equal hips.size, hips.uniq.size
  end

  test "恒星カタログのSIMBAD識別子が一意である" do
    ids = stars.map { |_, simbad_id, *| simbad_id }
    assert_equal ids.size, ids.uniq.size
  end

  test "恒星カタログの座標と等級が数値として妥当である" do
    stars.each do |hip, simbad_id, ra, dec, v_mag|
      assert_match(/\A\d+\z/, hip, "HIPが数値でない: #{simbad_id}")
      assert_includes 0.0..360.0, Float(ra), "赤経が範囲外: #{simbad_id}"
      assert_includes(-90.0..90.0, Float(dec), "赤緯が範囲外: #{simbad_id}")
      assert_includes(-2.0..7.0, Float(v_mag), "等級が範囲外: #{simbad_id}")
    end
  end

  test "星座が88件で略号・学名・和名が一意である" do
    assert_equal 88, constellations.size
    %w[略号 学名 和名].each_with_index do |label, i|
      values = constellations.map { |row| row[i] }
      assert_equal values.size, values.uniq.size, "#{label}が重複しています"
    end
  end

  test "全ての星座線の端点が恒星カタログに存在する" do
    catalog = stars.map { |hip, *| hip }.to_set
    missing = lines.reject { |_, s, e| catalog.include?(s) && catalog.include?(e) }
    assert_empty missing, "端点を解決できない星座線があります"
  end

  test "全ての星座線の略号が星座定義に存在する" do
    known = constellations.map(&:first).to_set
    assert_empty lines.map(&:first).uniq.reject { |abbr| known.include?(abbr) }
  end

  test "星座線に自己ループが無い" do
    assert_empty lines.select { |_, s, e| s == e }
  end

  test "星座線が重複していない" do
    # constellation_lines の一意インデックスに違反するため
    assert_empty lines.tally.select { |_, count| count > 1 }.keys
  end

  test "全ての星座に少なくとも1本の線がある" do
    drawn = lines.map(&:first).to_set
    assert_empty constellations.map(&:first).reject { |abbr| drawn.include?(abbr) }
  end
end
