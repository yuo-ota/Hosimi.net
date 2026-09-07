class AddAbbreviationToConstellations < ActiveRecord::Migration[8.0]
  def change
    # IAU が定める3文字の星座略号 (例: Ori, UMa)。
    # 星座線データがこの略号で星座を指すため保持する。
    add_column :constellations, :abbreviation, :string
    add_index :constellations, :abbreviation, unique: true
  end
end
