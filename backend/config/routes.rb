Rails.application.routes.draw do
  # GET /api/geolocation/{locationName}
  get 'api/geolocation/:locationName', to: 'geolocation#show'

  # GET /api/equatorialCoords/{latitude}/{longitude}
  get 'api/equatorialCoords/:latitude/:longitude', to: 'equatorial_coords#show'

  # GET /api/stars/{id}
  get 'api/stars/:id', to: 'stars#show'

  # GET /api/stars?minVMag=&maxVMag=
  get 'api/stars', to: 'stars#index'

  # GET /api/constellations
  get 'api/constellations', to: 'constellations#index'
end
