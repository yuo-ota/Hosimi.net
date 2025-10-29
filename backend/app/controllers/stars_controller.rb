require_relative "../services/star_service/star_service"

class StarsController < ApplicationController
    # GET /api/stars/{id}
    def show
        star = Star.find(params[:id])
        
        begin
            data = StarsService::StarService.research_star(star.simbad_id)
            render json: data, status: :ok
        rescue TooManyRequestsError => e
            Rails.logger.error e.message
            Rails.logger.error e.backtrace.join("\n")
            render json: { error: e.message }, status: :too_many_requests  # 429
        rescue StandardError => e
            Rails.logger.error e.message
            Rails.logger.error e.backtrace.join("\n")
            render json: { error: e.message }, status: :internal_server_error  # 500
        end
    end

    # GET /api/stars?minVMag=&maxVMag=
    def index
        begin
            # パラメータ取得・必須チェック
            min_vmag = params[:minVMag]
            max_vmag = params[:maxVMag]

            if min_vmag.blank? || max_vmag.blank?
                return render json: { error: "minVMagとmaxVMagは必須です" }, status: :bad_request # 400
            end

            min_vmag = min_vmag.to_f
            max_vmag = max_vmag.to_f

            # 範囲指定で星を取得
            stars = Star.where(v_mag: min_vmag..max_vmag)

            # JSON形式に整形
            result = stars.map do |star|
            {
                starId: star.id.to_s,
                declination: star.declination.to_f,
                rightAscension: star.right_ascension.to_f,
                vMag: star.v_mag
            }
            end

            render json: result, status: :ok
        rescue => e
            render json: { error: e.message }, status: :internal_server_error  # 500
        end
    end
end
