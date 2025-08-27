require_relative '../access_manager'
require_relative './geolocation_manager'

class GeolocationService
    MAX_REQUESTS = 1
    ACCESS_MANAGE_BASE_TIME = 10


    # -----------------------
    # 公開メソッド（外部から呼ぶ）
    # -----------------------

    def searchLocation(location_name)
        access_manager = AccessManager.new(
            max_requests: MAX_REQUESTS,
            access_manage_base_time: ACCESS_MANAGE_BASE_TIME)
        status = access_manager.check_request

        data = GeocodingManager.fetch_coords_xml(location_name)
        location = GeocodingManager.parse_coords_xml(data)

        location
    end
end