class AddUniqueIndexToConstellationLines < ActiveRecord::Migration[8.0]
  INDEX_NAME = "index_constellation_lines_uniqueness".freeze

  def up
    # 一意インデックスを張る前に、過去の seed 実行で重複した行を削除しておく。
    execute <<~SQL
      DELETE FROM constellation_lines
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM constellation_lines
        GROUP BY constellation_id, start_star_id, end_star_id
      )
    SQL

    add_index :constellation_lines,
              [ :constellation_id, :start_star_id, :end_star_id ],
              unique: true,
              name: INDEX_NAME
  end

  def down
    remove_index :constellation_lines, name: INDEX_NAME
  end
end
