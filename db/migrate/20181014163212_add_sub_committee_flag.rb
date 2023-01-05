class AddSubCommitteeFlag < ActiveRecord::Migration[5.0]
  def change
    add_column :venues, :sub_committee, :boolean, :default => false
  end
end
