require_relative "../services/equatorial_coords/equatorial_coords_service"

class EquatorialCoordsController < ApplicationController
    # GET /api/equatorialCoords/{latitude}/{longitude}
    def show
        latitude = params[:latitude].to_f
        longitude = params[:longitude].to_f
        
        begin
            data = EquatorialCoordsService.calc_equatorial_coords_by_user(latitude, longitude)
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
end