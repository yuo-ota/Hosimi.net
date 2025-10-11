require_relative '../access_manager'
require_relative './horizon_API_manager'
require_relative './moon_horizontal_coords_API_manager'

require 'json'

class EquatorialCoordsService
    HORIZON_MAX_REQUESTS = 10
    HORIZON_ACCESS_MANAGE_BASE_TIME = 30
    MOON_HORIZONTAL_API_MAX_REQUESTS = 10
    MOON_HORIZONTAL_API_ACCESS_MANAGE_BASE_TIME = 30

    @horizon_access_manager = AccessManager.new(
        max_requests: HORIZON_MAX_REQUESTS,
        access_manage_base_time: HORIZON_ACCESS_MANAGE_BASE_TIME
    )
    @moon_horizontal_API_access_manager = AccessManager.new(
        max_requests: MOON_HORIZONTAL_API_MAX_REQUESTS,
        access_manage_base_time: MOON_HORIZONTAL_API_ACCESS_MANAGE_BASE_TIME
    )

    class << self
        attr_reader :horizon_access_manager, :moon_horizontal_API_access_manager
    end


    # -----------------------
    # 公開メソッド（外部から呼ぶ）
    # -----------------------

    def self.calc_equatorial_coords_by_user(latitude, longitude)
        moon_right_ascension = get_equatorial_coords_of_moon[:right_ascension]
        moon_azimuth = get_azimuth_by_horizontal_coords_of_moon

        correction_deg = calc_azimuth_right_ascension_diff(moon_azimuth, moon_right_ascension)

        right_ascension = calc_user_right_ascension(longitude, correction_deg)
        declination = latitude

        build_location_json(right_ascension, declination)
    end


    # -----------------------
    # privateメソッド（内部処理用）
    # -----------------------
    private

    def self.get_equatorial_coords_of_moon
        status = EquatorialCoordsService.horizon_access_manager.check_request

        equatorial_coord = HorizonAPIManager.get_moon_equatorial_coords
        equatorial_coord
    end

    def self.get_azimuth_by_horizontal_coords_of_moon
        status = EquatorialCoordsService.moon_horizontal_API_access_manager.check_request

        moon_azimuth = MoonHorizontalCoordsAPIManager.get_moon_azimuth
        moon_azimuth
    end

    def self.calc_azimuth_right_ascension_diff(moon_azimuth, moon_right_ascension)
        moon_azimuth - moon_right_ascension
    end

    def self.calc_user_right_ascension(longitude, correction_deg)
        longitude + correction_deg
    end

    # jsonの作成
    def self.build_location_json(right_ascension, declination)
        location_hash = {
            rightAscension: right_ascension,
            declination: declination
        }

        location_hash
    end
end

if __FILE__ == $0
    equatorial_coords_service = EquatorialCoordsService.new

    result = equatorial_coords_service.calc_equatorial_coords_by_user(35, 135)

    puts result
end