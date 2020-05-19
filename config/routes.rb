Rails.application.routes.draw do

  root to: "pages#home"


  namespace :api do
  	namespace :v1 do
  		post    '/sign-in',                            to: 'users#sign_in'
  		get     '/user-info',                          to: 'users#user_info'
  		get     '/calendar-jobs',                      to: 'jobs#calendar_jobs'
  	end
  	
  	get       '*path',                                to: 'v1/general#url_error'
  end
  
  get '*path', to: 'pages#home'
end
