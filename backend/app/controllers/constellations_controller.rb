class ConstellationsController < ApplicationController
    # GET /api/constellations
    def index
        begin
            constellations = Constellation.includes(:constellation_lines).all
            data = constellations.map { |c|
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
            render json: data, status: :ok
        rescue StandardError => e
            Rails.logger.error e.message
            Rails.logger.error e.backtrace.join("\n")
            render json: { error: e.message }, status: :internal_server_error  # 500
        end
    end
end
