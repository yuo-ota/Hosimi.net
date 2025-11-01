class CreateConstellationLines < ActiveRecord::Migration[8.0]
  def change
    create_table :constellation_lines do |t|
      t.references :start_star, null: false, foreign_key: { to_table: :stars }
      t.references :end_star, null: false, foreign_key: { to_table: :stars }
      t.references :constellation, null: false, foreign_key: true

      t.timestamps
    end
  end
end
