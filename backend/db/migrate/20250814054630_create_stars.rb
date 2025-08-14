class CreateStars < ActiveRecord::Migration[8.0]
  def change
    create_table :stars do |t|
      t.string :simbad_id, null: false
      t.decimal :right_ascension, precision: 10, scale: 6
      t.decimal :declination, precision: 10, scale: 6
      t.float :v_mag

      t.timestamps
    end
    add_index :stars, :simbad_id, unique: true
  end
end
