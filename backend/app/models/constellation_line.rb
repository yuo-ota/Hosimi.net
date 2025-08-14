class ConstellationLine < ApplicationRecord
  belongs_to :start_star
  belongs_to :end_star
  belongs_to :constellation
end
