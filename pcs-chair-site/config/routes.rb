PCSChairingAssistant::Application.routes.draw do

  resources :venues do
    member do
      get :admin
      get :papers
      post :addpaper
      delete :removepaper
      put :movepaper
    end
  end

  # Root
  root :to => "front#index"

end
