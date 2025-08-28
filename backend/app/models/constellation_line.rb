class ConstellationLine < ApplicationRecord
  belongs_to :start_star, class_name: "Star", foreign_key: "start_star_id"
  belongs_to :end_star, class_name: "Star", foreign_key: "end_star_id"
  belongs_to :constellation
end
