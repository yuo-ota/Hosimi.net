require "test_helper"
require "minitest/mock"

class EquatorialCoordsServiceTest < ActiveSupport::TestCase
  # 2026-09-07 17:58 UTC に外部APIから実際に取得した値。
  #   JPL Horizons (緯度90度/経度0度): 赤経 08h12m23.67s = 123.0986度
  #   mgpn.org     (緯度90度/経度0度): 方位角 312.8360度
  MOON_RIGHT_ASCENSION_DEG = 123.0986
  MOON_AZIMUTH_DEG = 312.8360

  # 上記時刻のグリニッジ恒星時の理論値。
  # 280.46061837 + 360.98564736629 * (JD - 2451545.0) から算出。
  EXPECTED_GREENWICH_SIDEREAL_TIME_DEG = 256.3249

  # 月の視位置と元期平均位置の差、および外部APIの分単位の丸めによる誤差の許容量
  SIDEREAL_TIME_TOLERANCE_DEG = 1.0

  test "月から求めた天頂の赤経がグリニッジ恒星時の理論値と一致する" do
    # 経度0度の観測地なら、天頂の赤経はグリニッジ恒星時そのものになる
    result = calc_with_stubbed_moon(latitude: 0.0, longitude: 0.0)

    assert_in_delta EXPECTED_GREENWICH_SIDEREAL_TIME_DEG,
                    result[:rightAscension],
                    SIDEREAL_TIME_TOLERANCE_DEG
  end

  test "天頂の赤経は地方恒星時になる" do
    result = calc_with_stubbed_moon(latitude: 35.0, longitude: 135.0)

    expected = (EXPECTED_GREENWICH_SIDEREAL_TIME_DEG + 135.0) % 360
    assert_in_delta expected, result[:rightAscension], SIDEREAL_TIME_TOLERANCE_DEG
  end

  test "西経でも赤経は0以上360未満に収まる" do
    result = calc_with_stubbed_moon(latitude: -33.9, longitude: -118.2)

    assert_operator result[:rightAscension], :>=, 0
    assert_operator result[:rightAscension], :<, 360
  end

  test "天頂の赤緯は観測地の緯度に等しい" do
    result = calc_with_stubbed_moon(latitude: 35.0, longitude: 135.0)

    assert_in_delta 35.0, result[:declination], 0.0001
  end

  test "レスポンスのキーはOpenAPI仕様どおりcamelCaseになっている" do
    result = calc_with_stubbed_moon(latitude: 35.0, longitude: 135.0)

    assert_equal %i[rightAscension declination].sort, result.keys.sort
  end

  private

  # 外部APIを叩かずに、実測値を返すスタブで計算させる
  def calc_with_stubbed_moon(latitude:, longitude:)
    moon_coords = { right_ascension: MOON_RIGHT_ASCENSION_DEG, declination: 21.6715 }

    EquatorialCoords::HorizonApiManager.stub(:get_moon_equatorial_coords, moon_coords) do
      EquatorialCoords::MoonHorizontalCoordsApiManager.stub(:get_moon_azimuth, MOON_AZIMUTH_DEG) do
        EquatorialCoords::EquatorialCoordsService.calc_equatorial_coords_by_user(latitude, longitude)
      end
    end
  end
end
