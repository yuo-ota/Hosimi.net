class AccessManager
    class TooManyRequestsError < StandardError; end

    def initialize(max_requests:, access_manage_base_time:)
        @max_requests = max_requests
        @access_manage_base_time = access_manage_base_time
        @request_count = 0
        @last_reset_time = Time.now
    end

    # リクエストを確認、状態を更新
    # 戻り値: { allowed: true/false, remaining: n, reset_in: sec }
    def check_request
        reset_counter_if_needed

        if @request_count >= @max_requests
            raise TooManyRequestsError, "リクエストが多すぎます"
        end

        @request_count += 1

        {
            allowed: true,
            remaining: @max_requests - @request_count,
            reset_in: (@access_manage_base_time - (Time.now - @last_reset_time)).ceil
        }
    end

    private

    def reset_counter_if_needed
        if Time.now - @last_reset_time >= @access_manage_base_time
            @request_count = 0
            @last_reset_time = Time.now
        end
    end
end