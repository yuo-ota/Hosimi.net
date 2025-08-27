require_relative 'simbad_fetcher'
require_relative 'star_parser'
require_relative 'star_classifier'
require_relative 'star_distance_calculator'

require 'nokogiri'
require 'json'

class StarService
    MAX_REQUESTS_PER_MINUTE = 30
    @@request_count = 0
    @@last_reset_time = Time.now


    # -----------------------
    # 公開メソッド（外部から呼ぶ）
    # -----------------------
    def research_star(star_name)
        check_request_limit

        data = SimbadFetcher.fetch_star_html(star_name)
        info = StarParser.parse_star_info(data)

        category = StarClassifier.classify_star_from_info(info)

        if category == 'G' then
            return build_star_json(star_name, category, nil)
        end
        
        distance = StarDistanceCalculator.calculate_distance(info)
        build_star_json(star_name, category, distance)
    end


    # -----------------------
    # privateメソッド（内部処理用）
    # -----------------------
    private
    
    # リクエスト数確認
    def check_request_limit
        reset_counter_if_needed
        if @@request_count >= MAX_REQUESTS_PER_MINUTE then
            raise TooManyRequestsError, "Simbadへのリクエストが多すぎます"
        end
        
        @@request_count += 1
    end

    # アクセス数管理
    def reset_counter_if_needed
        if Time.now - @@last_reset_time >= 60
            @@request_count = 0
            @@last_reset_time = Time.now
        end
    end

    # jsonの作成
    def build_star_json(name, category, distance)
        star_hash = {
            starName: name,
            category: category,
            distance: distance
        }

        star_hash.to_json
    end
end

if __FILE__ == $0
    service = StarService.new
    # 確認したい星のIDを指定
    test_star_name = "NGC 7209"
    results = service.research_star(test_star_name)

    puts "Fetched data for #{test_star_name}:"
    puts results
end