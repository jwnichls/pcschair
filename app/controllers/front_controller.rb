class FrontController < ApplicationController
  layout false
  
  def index
    @venues = Venue.all
    
    # this is the front page
  end
  
  def ntp
  end
end
