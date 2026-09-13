require_relative "../../utils/scraping_utils"
require "uri"
require "json"

module Geolocation
    class GeocodingManager
        NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search"
        # Nominatim の利用ポリシーにより、送信元を識別できる User-Agent が必須
        USER_AGENT = "hosimi.net/1.0 (https://hosimi.net)"

        # -----------------------
        # 公開メソッド（外部から呼ぶ）
        # -----------------------

        # 位置情報JSON取得（Nominatim）
        def self.fetch_coords_json(location_name)
            encoded_name = URI.encode_www_form_component(location_name)
            url = "#{NOMINATIM_SEARCH_URL}?q=#{encoded_name}&format=jsonv2&limit=1&accept-language=ja"

            json = ScrapingUtils.fetch_data_by_url(url, "User-Agent" => USER_AGENT)
            JSON.parse(json)
        end

        # 位置情報JSON解析
        def self.parse_coords_json(data)
            result = data.first

            {
                latitude: result&.dig("lat"),
                longitude: result&.dig("lon")
            }
        end
    end
end
