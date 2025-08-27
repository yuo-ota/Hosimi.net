class ManageAccess
    class TooManyRequestsError < StandardError; end

    def initialize(max_requests_per_minute:, access_threshold:)
        @max_requests_per_minute = max_requests_per_minute
        @access_threshold = access_threshold
        @request_count = 0
        @last_reset_time = Time.now
    end

    # リクエストを確認、状態を更新
    # 戻り値: { allowed: true/false, remaining: n, reset_in: sec }
    def check_request
        reset_counter_if_needed

        if @request_count >= @max_requests_per_minute
            raise TooManyRequestsError, "リクエストが多すぎます"
        end

        @request_count += 1

        {
            allowed: true,
            remaining: @max_requests_per_minute - @request_count,
            reset_in: (@access_threshold - (Time.now - @last_reset_time)).ceil
        }
    end

    private

    def reset_counter_if_needed
        if Time.now - @last_reset_time >= @access_threshold
            @request_count = 0
            @last_reset_time = Time.now
        end
    end
end