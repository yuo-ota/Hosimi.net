# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_08_14_055513) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "constellation_lines", force: :cascade do |t|
    t.bigint "start_star_id", null: false
    t.bigint "end_star_id", null: false
    t.bigint "constellation_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["constellation_id"], name: "index_constellation_lines_on_constellation_id"
    t.index ["end_star_id"], name: "index_constellation_lines_on_end_star_id"
    t.index ["start_star_id"], name: "index_constellation_lines_on_start_star_id"
  end

  create_table "constellations", force: :cascade do |t|
    t.string "constellation_name_eng", null: false
    t.string "constellation_name_jpn", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["constellation_name_eng"], name: "index_constellations_on_constellation_name_eng", unique: true
    t.index ["constellation_name_jpn"], name: "index_constellations_on_constellation_name_jpn", unique: true
  end

  create_table "stars", force: :cascade do |t|
    t.string "simbad_id", null: false
    t.decimal "right_ascension", precision: 10, scale: 6
    t.decimal "declination", precision: 10, scale: 6
    t.float "v_mag"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["simbad_id"], name: "index_stars_on_simbad_id", unique: true
  end

  add_foreign_key "constellation_lines", "constellations"
  add_foreign_key "constellation_lines", "stars", column: "end_star_id"
  add_foreign_key "constellation_lines", "stars", column: "start_star_id"
end
