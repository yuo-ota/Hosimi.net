require_relative '../manage_access'
require_relative 'simbad_fetcher'
require_relative 'star_parser'
require_relative 'star_classifier'
require_relative 'star_distance_calculator'

require 'nokogiri'
require 'json'

class StarService
    MAX_REQUESTS_PER_MINUTE = 30
    ACCESS_THRESHOLD = 60


    # -----------------------
    # 公開メソッド（外部から呼ぶ）
    # -----------------------
    def research_star(star_name)
        access_manager = ManageAccess.new(
            max_requests_per_minute: MAX_REQUESTS_PER_MINUTE,
            access_threshold: ACCESS_THRESHOLD)
        status = access_manager.check_request

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