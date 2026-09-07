require_relative "../access_manager"
require_relative "./horizon_api_manager"
require_relative "./moon_horizontal_coords_api_manager"

require "json"

module EquatorialCoords
    class EquatorialCoordsService
        HORIZON_MAX_REQUESTS = 10
        HORIZON_ACCESS_MANAGE_BASE_TIME = 30
        MOON_HORIZONTAL_API_MAX_REQUESTS = 10
        MOON_HORIZONTAL_API_ACCESS_MANAGE_BASE_TIME = 30

        # 外部APIには常に「緯度90度・経度0度(北極)」の観測地を渡している。
        # 北極では地平座標の変換式が退化し、天体の方位角 A と時角 H の間に
        # A = H + 180 という関係が成り立つ。経度0度なので、この H は
        # グリニッジ時角 (= グリニッジ恒星時 - 赤経) そのものになる。
        POLAR_AZIMUTH_OFFSET_DEG = 180

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

        # 観測地の天頂が指す赤道座標を返す。
        # 天頂の赤緯は観測地の緯度に等しく、天頂の赤経は地方恒星時に等しい。
        def self.calc_equatorial_coords_by_user(latitude, longitude)
            moon_right_ascension = get_equatorial_coords_of_moon[:right_ascension]
            moon_azimuth = get_azimuth_by_horizontal_coords_of_moon

            greenwich_sidereal_time = calc_greenwich_sidereal_time(moon_azimuth, moon_right_ascension)

            right_ascension = calc_user_right_ascension(longitude, greenwich_sidereal_time)
            declination = latitude

            build_location_json(right_ascension, declination)
        end


        # -----------------------
        # privateメソッド（内部処理用）
        # -----------------------
        private

        def self.get_equatorial_coords_of_moon
            EquatorialCoordsService.horizon_access_manager.check_request

            HorizonApiManager.get_moon_equatorial_coords
        end

        def self.get_azimuth_by_horizontal_coords_of_moon
            EquatorialCoordsService.moon_horizontal_API_access_manager.check_request

            MoonHorizontalCoordsApiManager.get_moon_azimuth
        end

        # 月の方位角と赤経からグリニッジ恒星時を求める。
        # A = H + 180 かつ H = 恒星時 - 赤経 なので、恒星時 = A + 赤経 - 180。
        def self.calc_greenwich_sidereal_time(moon_azimuth, moon_right_ascension)
            (moon_azimuth + moon_right_ascension - POLAR_AZIMUTH_OFFSET_DEG) % 360
        end

        # 地方恒星時 = グリニッジ恒星時 + 経度(東経を正)
        def self.calc_user_right_ascension(longitude, greenwich_sidereal_time)
            (greenwich_sidereal_time + longitude) % 360
        end

        # jsonの作成
        # キー名は docs/API.html (OpenAPI仕様) およびフロントの型ガードに合わせて camelCase にする
        def self.build_location_json(right_ascension, declination)
            location_hash = {
                rightAscension: right_ascension,
                declination: declination
            }

            location_hash
        end
    end
end
