class EquatorialCoordsController < ApplicationController
    # GET /api/equatorialCoords/{latitude}/{longitude}
    def show
        latitude = params[:latitude]
        longitude = params[:longitude]

        EquatorialCoordsManager.calcEquatorialCoords(latitude, longitude)
    end
end