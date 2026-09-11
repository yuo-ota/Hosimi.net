require "test_helper"

class AccessManagerTest < ActiveSupport::TestCase
  test "上限内のリクエストは残り回数を返す" do
    manager = AccessManager.new(max_requests: 2, access_manage_base_time: 30)

    assert_equal 1, manager.check_request[:remaining]
    assert_equal 0, manager.check_request[:remaining]
  end

  # コントローラが rescue するのはトップレベルの TooManyRequestsError なので、
  # AccessManager 配下にネストした別クラスを投げると 429 ではなく 500 になってしまう
  test "上限を超えるとコントローラがrescueできるTooManyRequestsErrorを投げる" do
    manager = AccessManager.new(max_requests: 1, access_manage_base_time: 30)
    manager.check_request

    assert_raises(TooManyRequestsError) { manager.check_request }
  end

  test "基準時間を過ぎるとカウンタがリセットされる" do
    manager = AccessManager.new(max_requests: 1, access_manage_base_time: 30)
    manager.check_request

    travel 31.seconds do
      assert_nothing_raised { manager.check_request }
    end
  end
end
