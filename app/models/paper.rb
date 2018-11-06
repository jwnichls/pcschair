class Paper < ActiveRecord::Base
  belongs_to :venue
  # attr_accessible :pcs_paper_id, :venue_id, :listorder
  
  def moveup
    papers = venue.papers.where("listorder < ?",self.listorder).order(:listorder)
    
    if papers.length == 1
      self.listorder = papers[0].listorder - 1.0
    elsif papers.length > 1
      self.listorder = (papers[papers.length-1].listorder + papers[papers.length-2].listorder) / 2
    end
  end
  
  def movedown
    papers = venue.papers.where("listorder > ?",self.listorder).order(:listorder)
    
    if papers.length == 1
      self.listorder = papers[0].listorder + 1.0
    elsif papers.length > 1
      self.listorder = (papers[0].listorder + papers[1].listorder) / 2
    end
  end
  
  before_create do
    self.listorder = Paper.maximum(:listorder)
    if self.listorder == nil
      self.listorder = 1.0
    else
      self.listorder += 1.0
    end
  end
end
