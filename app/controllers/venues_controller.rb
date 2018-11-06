class VenuesController < ApplicationController
  skip_before_action :verify_authenticity_token, :only => [:update]
  
  # GET /venues
  # GET /venues.json
  def index
    @venues = Venue.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @venues }
    end
  end

  # GET /venues/1
  # GET /venues/1.json
  def show
    @venue = Venue.find(params[:id])
    @papers = @venue.papers.order(:listorder)

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @venue }
    end
  end

  # GET /venues/1/admin
  def admin
    @venue = Venue.find(params[:id])
    @papers = @venue.papers.order(:listorder)

    respond_to do |format|
      format.html # admin.html.erb
    end
  end

  # GET /venues/new
  # GET /venues/new.json
  def new
    @venue = Venue.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @venue }
    end
  end

  # GET /venues/1/edit
  def edit
    @venue = Venue.find(params[:id])
  end

  # POST /venues
  # POST /venues.json
  def create
    @venue = Venue.new(venue_params)

    respond_to do |format|
      if @venue.save
        format.html { redirect_to @venue, notice: 'Venue was successfully created.' }
        format.json { render json: @venue, status: :created, location: @venue }
      else
        format.html { render action: "new" }
        format.json { render json: @venue.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /venues/1
  # PUT /venues/1.json
  def update
    @venue = Venue.find(params[:id])

    respond_to do |format|
      if @venue.update_attributes(venue_params)
        qpaper = @venue.papers.find_by_pcs_paper_id(@venue.paper_pcs_id)
        if qpaper != nil and !@venue.breaktime
          qpaper.destroy
        end

        format.html { redirect_to @venue, notice: 'Venue was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @venue.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /venues/1
  # DELETE /venues/1.json
  def destroy
    @venue = Venue.find(params[:id])
    @venue.destroy

    respond_to do |format|
      format.html { redirect_to venues_url }
      format.json { head :no_content }
    end
  end
  
  def papers
    @venue = Venue.find(params[:id])
    
    render json: @venue.papers.order(:listorder)
  end
  
  # POST /venues/1/papers.json
  def addpaper
    @venue = Venue.find(params[:id])
    @venue.papers << Paper.new({:pcs_paper_id => params[:pcs_id]})

    respond_to do |format|
      format.html { redirect_to venues_url }
      format.json { head :no_content }
    end
  end
  
  # DELETE /venues/1/papers/1.json
  def removepaper
    @venue = Venue.find(params[:id])
    @paper = @venue.papers.find_by_pcs_paper_id(params[:pcs_id])
    @paper.destroy

    respond_to do |format|
      format.html { redirect_to venues_url }
      format.json { head :no_content }
    end
  end
  
  def movepaper
    @venue = Venue.find(params[:id])
    @paper = @venue.papers.find_by_pcs_paper_id(params[:pcs_id])
    direction = (params[:dir] == "true")

    # make the movement happen
    if direction
      @paper.moveup
    else
      @paper.movedown
    end

    respond_to do |format|
      if @paper.save
        format.html { redirect_to venues_url }
        format.json { head :no_content }
      else
        format.html { redirect_to venues_url }
        format.json { render json: @paper.errors, status: :unprocessable_entity }
      end
    end
  end
  
  private
  
  def venue_params
    params.require(:venue).permit(:active_paper, :breaktime, :name, :paper_authors, :paper_pcs_id, :paper_title, :timer, :pcs2_flag, :pcs2_venue_name, :allow_adds, :sub_committee)
  end
end
