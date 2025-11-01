module StarsService
    class StarParser
        # -----------------------
        # 公開メソッド（外部から呼ぶ）
        # -----------------------

        # 星情報範囲抽出
        def self.parse_star_info(data)
            info = extract_information_panel(data)
            info
        end

        # 任意のテキストからtrタグを探す
        def self.extract_tr_by_text(data, text)
            # text を含む span 要素を探す
            span = data.at_xpath("//span[contains(., '#{text}')]")
            tr = span&.ancestors('tr')&.first

            tr
        end

        # trタグ内のオブジェクトのうちttタグに囲われた要素の配列を取得する
        def self.extract_tt_texts(tr)
            return [] unless tr

            # 2番目の td を取得
            td = tr.css('td')[1]
            return [] unless td

            # td 内の tt タグだけを取得し、そのテキストを配列化
            td.css('tt').map { |tt| tt.text.strip }.reject(&:empty?)
        end

        
        # -----------------------
        # privateメソッド（内部処理用）
        # -----------------------
        private

        # 星情報部の抽出
        def self.extract_information_panel(data)
            td = data.at('td#basic_data[valign="TOP"]')
            table = td.at('table')

            table
        end
    end
end