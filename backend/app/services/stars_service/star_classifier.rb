module StarsService
    class StarClassifier
        # -----------------------
        # 公開メソッド（外部から呼ぶ）
        # -----------------------

        # カテゴリー設定
        def self.classify_star_from_info(info)
            categories = extract_category(info)
            classify_star(categories.map(&:strip))
        end
        
        
        # -----------------------
        # privateメソッド（内部処理用）
        # -----------------------
        private

        # カテゴリーの抽出
        def self.extract_category(info)
            tr = StarParser.extract_tr_by_text(info, 'Other object types')
            categories = StarParser.extract_tt_texts(tr)

            categories
        end

        # カテゴリー
        def self.classify_star(categories)
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
    end
end