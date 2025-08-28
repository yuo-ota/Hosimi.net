require_relative '../../app/utils/unit_converter'

file_path = "c:/Users/yuuta/Documents/Astronom/backend/simbad.txt"

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

puts "星データの投入が完了しました。"