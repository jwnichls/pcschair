class CreateVenues < ActiveRecord::Migration
  def change
    enable_extension 'uuid-ossp'
    create_table :venues, id: :uuid do |t|
      t.string :name
      t.boolean :active_paper
      t.datetime :timer
      t.boolean :breaktime
      t.string :paper_title
      t.string :paper_authors
      t.integer :paper_pcs_id

      t.timestamps
    end
  end
end
