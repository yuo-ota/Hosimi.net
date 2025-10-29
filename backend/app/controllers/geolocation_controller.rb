require_relative "../services/geolocation/geolocation_service"

class GeolocationController < ApplicationController
    # GET /api/geolocation/{locationName}
    def show
        location_name = params[:locationName]
        
        begin
            data = Geolocation::GeolocationService.search_location(location_name)
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