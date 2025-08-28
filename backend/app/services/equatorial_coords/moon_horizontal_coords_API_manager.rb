require_relative '../../utils/scraping_utils'

require 'json'

class MoonHorizontalCoordsAPIManager
    URL = "https://mgpn.org/api/moon/position.cgi?json&lat=90&lon=0"
    

    # -----------------------
    # 公開メソッド（外部から呼ぶ）
    # -----------------------

    # 月の地平座標取得
    def self.get_moon_azimuth
        json = fetch_coords_json
        get_moon_azimuth_from_json(json)
    end


    # -----------------------
    # privateメソッド（内部処理用）
    # -----------------------
    private

    def self.fetch_coords_json
        data = ScrapingUtils.fetch_data_by_url(URL)
        json = JSON.parse(data)
    end

    def self.get_moon_azimuth_from_json(json)
        json['result']['azimuth']
    end
end

if __FILE__ == $0
    result = MoonHorizontalCoordsManager.get_moon_azimuth

    puts result
end