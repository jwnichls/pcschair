class CreateVenues < ActiveRecord::Migration
  def change
    create_table :venues do |t|
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
