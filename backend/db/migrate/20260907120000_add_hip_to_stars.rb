class AddHipToStars < ActiveRecord::Migration[8.0]
  def change
    # ヒッパルコス星表番号。星座線データが星をこの番号で指すため保持する。
    # 星団や銀河など HIP を持たない天体があるため NULL を許容する。
    add_column :stars, :hip, :integer
    add_index :stars, :hip, unique: true
  end
end
