require_relative '../../utils/scraping_utils'
require 'uri'

module Geolocation
    class GeocodingManager
        # -----------------------
        # 公開メソッド（外部から呼ぶ）
        # -----------------------

        # 位置情報XML取得
        def self.fetch_coords_xml(location_name)
            encoded_name = URI.encode_www_form_component(location_name)
            url = "https://www.geocoding.jp/api/?q=#{encoded_name}"

            xml = ScrapingUtils.fetch_data_by_url(url)
            ScrapingUtils.fetch_xml(xml)
        end

        # 位置情報XML解析
        def self.parse_coords_xml(data)
            latitude = data.at_xpath("//coordinate/lat")&.text
            longitude = data.at_xpath("//coordinate/lng")&.text
            
            {
                latitude: latitude,
                longitude: longitude
            }
        end
    end
end