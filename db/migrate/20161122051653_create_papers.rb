class CreatePapers < ActiveRecord::Migration[5.0]
  def change
    enable_extension 'uuid-ossp'
    create_table :papers, id: :uuid do |t|
      t.uuid :venue_id
      t.integer :pcs_paper_id
      t.float :listorder

      t.timestamps
    end
  end
end
