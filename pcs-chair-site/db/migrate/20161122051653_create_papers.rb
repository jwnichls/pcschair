class CreatePapers < ActiveRecord::Migration
  def change
    create_table :papers do |t|
      t.integer :venue_id
      t.integer :pcs_paper_id
      t.float :listorder

      t.timestamps
    end
  end
end
