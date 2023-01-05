class AddPcs2FlagAndVenueNameToVenues < ActiveRecord::Migration[5.0]
  def change
    add_column :venues, :pcs2_flag, :boolean
    add_column :venues, :pcs2_venue_name, :string
  end
end
