class StarDistanceCalculator
    LIGHT_YEAR_PER_PARSEC = 3.26156


    # -----------------------
    # 公開メソッド（外部から呼ぶ）
    # -----------------------

    # 距離設定
    def self.calculate_distance(info)
        parallax = extract_parallax(info)
        calc_distance_from_parallax(parallax)
    end


    # -----------------------
    # privateメソッド（内部処理用）
    # -----------------------
    private

    # 視差の抽出
    def self.extract_parallax(info)
        tr = StarParser.extract_tr_by_text(info, 'Parallaxes (mas)')
        tt_texts = StarParser.extract_tt_texts(tr)
        puts(tt_texts)
        parallax = tt_texts.first.split(" ").first

        parallax
    end

    # 視差から距離を計算
    def self.calc_distance_from_parallax(parallax_mas)
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
end