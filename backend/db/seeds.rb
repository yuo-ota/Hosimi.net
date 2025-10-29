# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

require_relative '../app/utils/unit_converter'

file_path = "/rails/simbad.txt"

File.foreach(file_path) do |line|
    # パイプ区切りで分割
    parts = line.split("|").map(&:strip)
    next unless parts.size == 4

    simbad_id = parts[1]
    coord = parts[2]
    v_mag = parts[3].to_f

    # 赤経RAと赤緯Decに分割（空白で区切り、RAは3つ、Decは3つ）
    coord_parts = coord.strip.split
    if coord_parts.size >= 6
        ra = UnitConverter.ha_to_deg(coord_parts[0], coord_parts[1], coord_parts[2])
        dec = UnitConverter.dms_to_deg(coord_parts[3], coord_parts[4], coord_parts[5])
    else
        ra = ""
        dec = ""
    end

    # DBに投入
    Star.create!(
        simbad_id: simbad_id,
        right_ascension: ra,
        declination: dec,
        v_mag: v_mag
    )
end

constellations = [
  ["Andromeda", "アンドロメダ座"],
  ["Antlia", "ポンプ座"],
  ["Apus", "ふくちょう座"],
  ["Aquarius", "みずがめ座"],
  ["Aquila", "わし座"],
  ["Ara", "さいだん座"],
  ["Aries", "おひつじ座"],
  ["Auriga", "ぎょしゃ座"],
  ["Bootes", "うしかい座"],
  ["Caelum", "ちょうこくぐ座"],
  ["Camelopardalis", "きりん座"],
  ["Cancer", "かに座"],
  ["Canes Venatici", "りょうけん座"],
  ["Canis Major", "おおいぬ座"],
  ["Canis Minor", "こいぬ座"],
  ["Capricornus", "やぎ座"],
  ["Carina", "りゅうこつ座"],
  ["Cassiopeia", "カシオペヤ座"],
  ["Centaurus", "ケンタウルス座"],
  ["Cepheus", "ケフェウス座"],
  ["Cetus", "くじら座"],
  ["Chamaeleon", "カメレオン座"],
  ["Circinus", "コンパス座"],
  ["Columba", "はと座"],
  ["Coma Berenices", "かみのけ座"],
  ["Corona Australis", "みなみのかんむり座"],
  ["Corona Borealis", "かんむり座"],
  ["Corvus", "からす座"],
  ["Crater", "コップ座"],
  ["Crux", "みなみじゅうじ座"],
  ["Cygnus", "はくちょう座"],
  ["Delphinus", "いるか座"],
  ["Dorado", "かじき座"],
  ["Draco", "りゅう座"],
  ["Equuleus", "こうま座"],
  ["Eridanus", "エリダヌス座"],
  ["Fornax", "ろ座"],
  ["Gemini", "ふたご座"],
  ["Grus", "つる座"],
  ["Hercules", "ヘラクレス座"],
  ["Horologium", "とけい座"],
  ["Hydra", "うみへび座"],
  ["Hydrus", "みずへび座"],
  ["Indus", "インディアン座"],
  ["Lacerta", "とかげ座"],
  ["Leo", "しし座"],
  ["Leo Minor", "こじし座"],
  ["Lepus", "うさぎ座"],
  ["Libra", "てんびん座"],
  ["Lupus", "おおかみ座"],
  ["Lynx", "やまねこ座"],
  ["Lyra", "こと座"],
  ["Mensa", "テーブルさん座"],
  ["Microscopium", "けんびきょう座"],
  ["Monoceros", "いっかくじゅう座"],
  ["Musca", "はえ座"],
  ["Norma", "じょうぎ座"],
  ["Octans", "はちぶんぎ座"],
  ["Ophiuchus", "へびつかい座"],
  ["Orion", "オリオン座"],
  ["Pavo", "くじゃく座"],
  ["Pegasus", "ペガスス座"],
  ["Perseus", "ペルセウス座"],
  ["Phoenix", "ほうほう座"],
  ["Pictor", "がか座"],
  ["Pisces", "うお座"],
  ["Pisces Austrinus", "みなみのうお座"],
  ["Puppis", "とも座"],
  ["Pyxis", "らしんばん座"],
  ["Reticulum", "レチクル座"],
  ["Sagitta", "や座"],
  ["Sagittarius", "いて座"],
  ["Scorpius", "さそり座"],
  ["Sculptor", "ちょうこくしつ座"],
  ["Scutum", "たて座"],
  ["Serpens", "へび座"],
  ["Sextans", "ろくぶんぎ座"],
  ["Taurus", "おうし座"],
  ["Telescopium", "ぼうえんきょう座"],
  ["Triangulum", "さんかく座"],
  ["Triangulum Australe", "みなみのさんかく座"],
  ["Tucana", "きょしちょう座"],
  ["Ursa Major", "おおぐま座"],
  ["Ursa Minor", "こぐま座"],
  ["Vela", "ほ座"],
  ["Virgo", "おとめ座"],
  ["Volans", "とびうお座"],
  ["Vulpecula", "こぎつね座"]
]

constellations.each do |eng, jpn|
  Constellation.create!(
    constellation_name_eng: eng,
    constellation_name_jpn: jpn
  )
end

# puts "Constellations seeded: #{constellations.size}"

# Constellation Lines data
# constellation_lines_data = [
#   [1, 33, 403],
#   [1, 230, 1112],
#   [1, 283, 828],
#   [1, 403, 1457],
#   [1, 404, 714],
#   [1, 578, 33],
#   [1, 587, 1346],
#   [1, 1112, 283],
#   [1, 1338, 311],
#   [1, 1457, 587],
#   [1, 1666, 1480],
#   [1, 230, 1338],
#   [1, 578, 1666],
#   [1, 1457, 933],
#   [1, 1666, 230]
# ]

# constellation_lines_data.each do |constellation_id, start_star_id, end_star_id|
#   ConstellationLine.create!(
#     constellation_id: constellation_id,
#     start_star_id: start_star_id,
#     end_star_id: end_star_id
#   )
# end

# puts "Constellation lines seeded: #{constellation_lines_data.size}"