Rails.application.routes.draw do

  root to: "pages#home"


  namespace :api do
  	namespace :v1 do
  		post    '/sign-in',                            to: 'users#sign_in'
  		get     '/user-info',                          to: 'users#user_info'
      get     '/users-collection',                   to: 'users#users_collection'

  		get     '/calendar-jobs',                      to: 'jobs#calendar_jobs'
      get     '/day-jobs',                           to: 'jobs#day_jobs'
      get     '/jobs',                               to: 'jobs#index'
      get     '/jobs/:id',                           to: 'jobs#show'
      post    '/jobs',                               to: 'jobs#create'
      get     '/jobs/:id/edit',                      to: 'jobs#edit'
      put     '/jobs/:id',                           to: 'jobs#update'
  	end

  	get       '*path',                                to: 'v1/general#url_error'
  end

  get '*path', to: 'pages#home'
end
