class AddSubcommitteeNumberToVenues < ActiveRecord::Migration[5.0]
  def change
    add_column :venues, :sub_committee_id, :integer, :default => 0
  end
end
