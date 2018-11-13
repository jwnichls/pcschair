Rails.application.routes.draw do

  resources :venues, :only => [:show,:update] do
    member do
      get :admin
      get :papers
      post :addpaper
      delete :removepaper
      put :movepaper
    end
  end

  # NTP
  get "/ntp" => "front#ntp"

  # Root
  root :to => "front#index"

end
