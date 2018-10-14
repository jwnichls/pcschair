class Venue < ActiveRecord::Base
  has_many :papers
  attr_accessible :active_paper, :breaktime, :name, :paper_authors, :paper_pcs_id, :paper_title, :timer, :pcs2_flag, :pcs2_venue_name, :allow_adds, :sub_committee
end
