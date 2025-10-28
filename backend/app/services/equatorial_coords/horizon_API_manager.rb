require_relative '../../utils/scraping_utils'
require_relative '../../utils/unit_converter'
require 'uri'

module EquatorialCoords
    class HorizonApiManager
        BASE_URL = "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND=%27301%27&CENTER=%27coord%40399%27&COORD_TYPE=GEODETIC&STEP_SIZE=60m&QUANTITIES=1&REF_SYSTEM=ICRF&SITE_COORD=%270%2C90%2C0%27&"

        # -----------------------
        # 公開メソッド（外部から呼ぶ）
        # -----------------------

        # 月の赤道座標取得
        def self.get_moon_equatorial_coords
            time_param = make_param
            
            url = "#{BASE_URL}#{time_param}"

            text = ScrapingUtils.fetch_data_by_url(url)
            equatorial_coords = parse_equatorial_coords_from_text(text)

            equatorial_coords
        end


        # -----------------------
        # privateメソッド（内部処理用）
        # -----------------------
        private

        # URLパラメーター作成
        def self.make_param
            start_time = Time.now.utc
            stop_time = start_time + 60

            params = [
                "START_TIME='#{start_time.strftime("%Y-%m-%d %H:%M")}'",
                "STOP_TIME='#{stop_time.strftime("%Y-%m-%d %H:%M")}'"
            ]

            # 個別にエンコードして & で結合
            encoded_params = params.map { |p| URI.encode_www_form_component(p).gsub('%3D', '=') }

            encoded_params.join("&")
        end

        # 位置情報XML解析
        def self.parse_equatorial_coords_from_text(text)
            # テキストで座標を取得
            equatorial_coord_text = extract_result_text(text)

            parts = equatorial_coord_text.split
            {
                right_ascension: UnitConverter.ha_to_deg(parts[0], parts[1], parts[2]),
                declination:    UnitConverter.dms_to_deg(parts[3], parts[4], parts[5])
            }
        end

        # API結果のブロック抽出
        def self.extract_result_text(text)
            result_block = text[/\$\$SOE\s*(.*?)\s*\$\$EOE/m, 1]
            result_now_data = result_block.split("\n")[0]

            # 赤緯, 赤経に該当する箇所の文字列の抽出 ex) "14 06 39.84 -17 48 13.4"
            equatorial_coord_text = result_now_data[-23..-1]
        end
    end
end

if __FILE__ == $0
    HorizonAPIManager.get_moon_equatorial_coords
end