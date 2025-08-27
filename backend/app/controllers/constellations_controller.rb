class ConstellationsController < ApplicationController
    # GET /api/constellations
    def index
        constellations = Constellation.includes(:constellation_lines).all

        render json: constellations.map { |c|
            {
                constellationName: c.constellation_name_jpn,
                constellationLines: c.constellation_lines.map { |line|
                    {
                        startStarId: line.start_star_id.to_s,
                        endStarId: line.end_star_id.to_s
                    }
                }
            }
        }
    end
end
