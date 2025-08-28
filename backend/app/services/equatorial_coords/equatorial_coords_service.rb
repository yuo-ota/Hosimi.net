require_relative '../access_manager'
require_relative './horizon_API_manager'

class EquatorialCoordsService
    HORIZON_MAX_REQUESTS = 10
    HORIZON_ACCESS_MANAGE_BASE_TIME = 30

    attr_reader :horizon_access_manager

    def initialize
        @@horizon_access_manager = AccessManager.new(
            max_requests: HORIZON_MAX_REQUESTS,
            access_manage_base_time: HORIZON_ACCESS_MANAGE_BASE_TIME
        )
    end


    # -----------------------
    # 公開メソッド（外部から呼ぶ）
    # -----------------------

    def calcEquatorialCoords(latitude, longitude)
        
    end


    # -----------------------
    # privateメソッド（内部処理用）
    # -----------------------
    private

    def get_moons_equatorial_coords
        status = horizon_access_manager.check_request

        equatorial_coord = EquatorialCoordsManager.fetch_equatorial_coords_text
        equatorial_coord
    end
end