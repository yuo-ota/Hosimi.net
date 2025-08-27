class StarsController < ApplicationController
    # GET /api/stars/{id}
    def show
        star = Star.find(params[:id])
        
        begin
            data = StarService.research_star(star.simbad_id)
            render json: data, status: :ok
        rescue TooManyRequestsError => e
            render json: { error: e.message }, status: :too_many_requests  # 429
        rescue StandardError => e
            render json: { error: e.message }, status: :internal_server_error  # 500
        end
    end

    def index
    end
end
