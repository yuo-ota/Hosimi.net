require_relative '../../utils/scraping_utils'

class SimbadFetcher
    # -----------------------
    # 公開メソッド（外部から呼ぶ）
    # -----------------------

    # 星情報HTML取得
    def self.fetch_star_html(star_name)
        url = "http://simbad.u-strasbg.fr/simbad/sim-id?Ident=#{star_name}&NbIdent=1"
        html = ScrapingUtils.fetch_html(url)
        ScrapingUtils.fetch_data(html)
    end
end