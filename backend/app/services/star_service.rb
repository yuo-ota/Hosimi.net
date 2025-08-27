require_relative '../utils/scraping_utils'
require 'nokogiri'
require 'json'

class StarService
    LIGHT_YEAR_PER_PARSEC = 3.26156

    MAX_REQUESTS_PER_MINUTE = 30
    @@request_count = 0
    @@last_reset_time = Time.now

    # -----------------------
    # 公開メソッド（外部から呼ぶ）
    # -----------------------
    def research_star(star_name)
        check_request_limit

        data = fetch_star_html(star_name)
        info = parse_star_info(data)

        category = classify_star_from_info(info)

        if category == 'G' then
            return build_star_json(star_name, category, nil)
        end
        
        distance = calculate_distance(info)
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

    # 星情報HTML取得
    def fetch_star_html(star_name)
        url = "http://simbad.u-strasbg.fr/simbad/sim-id?Ident=#{star_name}&NbIdent=1"
        html = ScrapingUtils.fetch_html(url)
        ScrapingUtils.fetch_data(html)
    end

    # 星情報範囲抽出
    def parse_star_info(data)
        info = extract_information_panel(data)
        info
    end

    # 星情報部の抽出
    def extract_information_panel(data)
        td = data.at('td#basic_data[valign="TOP"]')
        table = td.at('table')

        table
    end

    # カテゴリー設定
    def classify_star_from_info(info)
        categories = extract_category(info)
        classify_star(categories.map(&:strip))
    end

    # カテゴリーの抽出
    def extract_category(info)
        tr = extract_tr_by_text(info, 'Other object types')
        categories = extract_tt_texts(tr)

        categories
    end

    # カテゴリー
    def classify_star(categories)
        # 優先順位：銀河 > 星団 > 惑星状星雲 > 惑星 > 星
        if categories.include?("G")
            "銀河"
        elsif categories.include?("Cl*")
            "星団"
        elsif categories.include?("PN")
            "惑星状星雲"
        elsif categories.include?("Pl")
            "惑星"
        else
            # 上記に該当しなければ「星」とする
            "星"
        end
    end

    # 距離設定
    def calculate_distance(info)
        parallax = extract_parallax(info)
        calc_distance_from_parallax(parallax)
    end

    # 視差の抽出
    def extract_parallax(info)
        tr = extract_tr_by_text(info, 'Parallaxes (mas)')
        tt_texts = extract_tt_texts(tr)
        parallax = tt_texts.first.split(" ").first

        parallax
    end

    # 視差から距離を計算
    def calc_distance_from_parallax(parallax_mas)
        parallax_value = parallax_mas.to_f
        if parallax_value <= 0
            raise ArgumentError, "視差は正の値でなければなりません"
        end

        # mas → arcsec に変換
        parallax_arcsec = parallax_value / 1000.0

        # 距離（パーセク）
        distance_pc = 1.0 / parallax_arcsec

        # パーセク → 光年
        distance_light_year = distance_pc * LIGHT_YEAR_PER_PARSEC

        distance_light_year
    end

    # 任意のテキストからtrタグを探す
    def extract_tr_by_text(data, text)
        # text を含む span 要素を探す
        span = data.at_xpath("//span[contains(., '#{text}')]")
        tr = span&.ancestors('tr')&.first

        tr
    end

    # trタグ内のオブジェクトのうちttタグに囲われた要素の配列を取得する
    def extract_tt_texts(tr)
        return [] unless tr

        # 2番目の td を取得
        td = tr.css('td')[1]
        return [] unless td

        # td 内の tt タグだけを取得し、そのテキストを配列化
        td.css('tt').map { |tt| tt.text.strip }.reject(&:empty?)
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