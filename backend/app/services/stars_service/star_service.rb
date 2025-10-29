require_relative '../access_manager'
require_relative 'simbad_fetcher'
require_relative 'star_parser'
require_relative 'star_classifier'
require_relative 'star_distance_calculator'

require 'nokogiri'
require 'json'

module StarsService
    class StarService
        MAX_REQUESTS = 30
        ACCESS_MANAGE_BASE_TIME = 60
            
        @simbad_access_manager = AccessManager.new(
            max_requests: MAX_REQUESTS,
            access_manage_base_time: ACCESS_MANAGE_BASE_TIME
        )

        class << self
            attr_reader :simbad_access_manager
        end


        # -----------------------
        # 公開メソッド（外部から呼ぶ）
        # -----------------------

        def self.research_star(star_name)
            status = StarService.simbad_access_manager.check_request

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
        def self.build_star_json(name, category, distance)
            star_hash = {
                starName: name,
                category: category,
                distance: distance
            }

            star_hash
        end
    end
end

if __FILE__ == $0
    # 確認したい星のIDを指定
    test_star_name = "NGC 7209"
    results = StarService.research_star(test_star_name)

    puts "Fetched data for #{test_star_name}:"
    puts results
end