class AddPcs2FlagAndVenueNameToVenues < ActiveRecord::Migration
  def change
    add_column :venues, :pcs2_flag, :boolean
    add_column :venues, :pcs2_venue_name, :string
  end
end
