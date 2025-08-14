class CreateConstellations < ActiveRecord::Migration[8.0]
  def change
    create_table :constellations do |t|
      t.string :constellation_name_eng, null: false
      t.string :constellation_name_jpn, null: false

      t.timestamps
    end
    add_index :constellations, :constellation_name_eng, unique: true
    add_index :constellations, :constellation_name_jpn, unique: true
  end
end
