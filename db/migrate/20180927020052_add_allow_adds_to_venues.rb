class AddAllowAddsToVenues < ActiveRecord::Migration
  def change
    add_column :venues, :allow_adds, :boolean, :default => true
  end
end
