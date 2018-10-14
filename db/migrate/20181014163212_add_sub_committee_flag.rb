class AddSubCommitteeFlag < ActiveRecord::Migration
  def change
    add_column :venues, :sub_committee, :boolean, :default => false
  end
end
