require_relative '../access_manager'
require_relative './geocoding_manager'

require 'json'

class GeolocationService
    MAX_REQUESTS = 1
    ACCESS_MANAGE_BASE_TIME = 10

    attr_reader :geocoding_access_manager

    def initialize
        @@geocoding_access_manager = AccessManager.new(
            max_requests: MAX_REQUESTS,
            access_manage_base_time: ACCESS_MANAGE_BASE_TIME
        )
    end


    # -----------------------
    # 公開メソッド（外部から呼ぶ）
    # -----------------------

    def search_location(location_name)
        status = @access_manager.check_request

        data = GeocodingManager.fetch_coords_xml(location_name)
        location = GeocodingManager.parse_coords_xml(data)

        build_location_json(location[:latitude], location[:longitude])
    end


    # -----------------------
    # privateメソッド（内部処理用）
    # -----------------------
    private

    # jsonの作成
    def build_location_json(latitude, longitude)
        location_hash = {
            latitude: latitude&.to_f,
            longitude: longitude&.to_f
        }

        location_hash.to_json
    end
end

if __FILE__ == $0
    service = GeolocationService.new
    # 座標を取得したい地名を指定
    location_name = "横浜駅"
    result = service.search_location(location_name)

    puts "Fetched data for #{location_name}:"
    puts result
end