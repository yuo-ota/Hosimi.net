class EquatorialCoordsController < ApplicationController
    # GET /api/equatorialCoords/{latitude}/{longitude}
    def show
        latitude = params[:latitude]
        longitude = params[:longitude]
        
        begin
            data = EquatorialCoordsManager.calc_equatorial_coords(latitude, longitude)
            render json: data, status: :ok
        rescue TooManyRequestsError => e
            render json: { error: e.message }, status: :too_many_requests  # 429
        rescue StandardError => e
            render json: { error: e.message }, status: :internal_server_error  # 500
        end
    end
end