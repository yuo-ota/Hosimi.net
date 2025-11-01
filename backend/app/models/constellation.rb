class Constellation < ApplicationRecord
  has_many :constellation_lines, dependent: :destroy
end
