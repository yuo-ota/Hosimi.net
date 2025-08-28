class UnitConverter
    # 時角 (Hour Angle > HA): 360度を24時間に変換した方式 
    # [https://ja.wikipedia.org/wiki/%E6%99%82%E8%A7%92]

    # 度分秒 (Degree Minute Second > DMS): 角度を60進法にした方式
    # [https://support.esri.com/ja-jp/gis-dictionary/degrees-minutes-seconds]

    # 時角 → 度
    def self.ha_to_deg(hour, minute, second)
        hour.to_f * 15 + minute.to_f * 15 / 60 + second.to_f * 15 / 3600
    end

    # 度分秒 → 度
    def self.dms_to_deg(degree, minute, second)
        # 正負の確認
        sign = degree.to_f < 0 ? -1 : 1

        # degreeの絶対値
        degree_abs = degree.to_f.abs

        sign * (degree_abs + minute.to_f / 60 + second.to_f / 3600)
    end
end