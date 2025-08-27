class GeolocationFetcher
    # -----------------------
    # 公開メソッド（外部から呼ぶ）
    # -----------------------

    # 位置情報XML取得
    def self.fetch_coords_xml(location_name)
        url = "https://www.geocoding.jp/api/?q=#{location_name}"
        xml = ScrapingUtils.fetch_data_by_url(url)
        ScrapingUtils.fetch_xml(xml)
    end

    # 位置情報XML解析
    def self.parse_coords_xml(data)
        latitude = data.at_xpath("//coordinate/lat")
        longitude = data.at_xpath("//coordinate/lng")
        
        {
            latitude: latitude,
            longitude: longitude
        }
    end
end