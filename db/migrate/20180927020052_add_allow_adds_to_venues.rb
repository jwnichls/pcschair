class AddAllowAddsToVenues < ActiveRecord::Migration[5.0]
  def change
    add_column :venues, :allow_adds, :boolean, :default => true
  end
end
