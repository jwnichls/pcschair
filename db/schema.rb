# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_11_17_234551) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "papers", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "venue_id"
    t.integer "pcs_paper_id"
    t.float "listorder"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "venues", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "name"
    t.boolean "active_paper"
    t.datetime "timer"
    t.boolean "breaktime"
    t.string "paper_title"
    t.text "paper_authors"
    t.integer "paper_pcs_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "pcs2_flag"
    t.string "pcs2_venue_name"
    t.boolean "allow_adds", default: true
    t.boolean "sub_committee", default: false
    t.integer "sub_committee_id", default: 0
  end

end
