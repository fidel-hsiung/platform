require 'rails_helper'

RSpec.describe 'Api::V1::Users', type: :request do

  let(:user) {create(:user, email: 'test@test.com', password: '12345678')}
  let(:admin_user) {create(:admin_user)}

  describe 'Get /users' do
    it 'should render json' do
      users = []
      (0..4).each{|i| users[i] = create(:user)}

      temp = double()
      expect(UserFilter).to receive(:new).with(email: nil, first_name: nil, last_name: nil, roles: [], archived: nil).and_return(temp)
      expect(temp).to receive(:result).and_return(User.with_attached_avatar)

      get '/api/v1/users', params: {page: '1', sort_by: 'id', sort_method: 'desc'}, headers: headers(users[0])

      expect(response).to be_successful
      expect(json['users'].count).to eq 5
      expect(json['users'].map{|user| user['id']}).to eq [users[4].id, users[3].id, users[2].id, users[1].id, users[0].id]
      expect(json['total_pages']).to eq 1
    end
  end

  describe 'Post /users' do
    it 'should return error if not admin user' do
      post '/api/v1/users', params: {user: FactoryBot.attributes_for(:user)}, headers: headers

      expect(response.status).to eq 401
      expect(json).to eq ({'error' => ['You don\'t have the permission!']})
    end

    it 'should call SystemMailer, ActionCable and render json' do
      expect(SystemMailer).to receive_message_chain(:welcome_user, :deliver_later)
      expect(ActionCable.server).to receive(:broadcast).with('users_channel', {action_type: 'create'})
      expect(Api::V1::UserSerializer).to receive_message_chain(:new, :to_custom_hash).and_return({test: 'test'})
      post '/api/v1/users', params: {user: FactoryBot.attributes_for(:user)}, headers: headers(admin_user)

      expect(response).to be_successful
      expect(json).to eq ({'test' => 'test'})
    end

    it 'should error with invalid params' do
      expect(SystemMailer).to_not receive(:welcome_user)
      expect(ActionCable.server).to_not receive(:broadcast)
      post '/api/v1/users', params: {user: FactoryBot.attributes_for(:user, first_name: '')}, headers: headers(admin_user)

      expect(response.status).to eq 422
      expect(json).to eq ({'error' => {'first_name' => ['can\'t be blank']}})
    end
  end

  describe 'Get /users/:id' do
    it 'should render json' do
      get "/api/v1/users/#{admin_user.id}", headers: headers(admin_user)

      expect(response).to be_successful
      expect(json['id']).to eq admin_user.id
      expect(json['first_name']).to eq admin_user.first_name
      expect(json['last_name']).to eq admin_user.last_name
      expect(json['full_name']).to eq admin_user.full_name
      expect(json['email']).to eq admin_user.email
      expect(json['avatar_url']).to eq admin_user.avatar_url
      expect(json['role']).to eq admin_user.role
      expect(json['archived']).to eq '0'
      expect(json['errors']).to eq ({})
      expect(json['assigned_jobs_count']).to eq admin_user.assigned_jobs.size
      expect(json['assigned_active_jobs_count']).to eq admin_user.assigned_jobs.select(&:active?).size
      expect(json['assigned_failed_jobs_count']).to eq admin_user.assigned_jobs.select(&:failed?).size
      expect(json['assigned_finished_jobs_count']).to eq admin_user.assigned_jobs.select(&:finished?).size
    end
  end

  describe 'Put /users/:id' do
    it 'should return error if no permission' do
      put "/api/v1/users/#{user.id}", params: {user: {first_name: 'Test First Name'}}, headers: headers

      expect(response.status).to eq 401
      expect(json).to eq ({'error' => ['You don\'t have the permission!']})
    end

    it 'should update user, call ActionCable and render json' do
      expect(ActionCable.server).to receive(:broadcast).with('users_channel', {action_type: 'update'})
      expect do
        put "/api/v1/users/#{user.id}", params: {user: {first_name: 'Test First Name'}}, headers: headers(user)
      end.to change{user.reload.first_name}.to('Test First Name')

      expect(response).to be_successful
      expect(json['id']).to eq user.id
      expect(json['first_name']).to eq user.first_name
      expect(json['last_name']).to eq user.last_name
      expect(json['full_name']).to eq user.full_name
      expect(json['email']).to eq user.email
      expect(json['avatar_url']).to eq user.avatar_url
      expect(json['role']).to eq user.role
      expect(json['archived']).to eq '0'
      expect(json['errors']).to eq ({})
      expect(json['assigned_jobs_count']).to eq 0
      expect(json['assigned_active_jobs_count']).to eq 0
      expect(json['assigned_failed_jobs_count']).to eq 0
      expect(json['assigned_finished_jobs_count']).to eq 0
    end

    it 'should not update user and return error with invalid params' do
      expect(ActionCable.server).to_not receive(:broadcast)
      expect do
        put "/api/v1/users/#{user.id}", params: {user: {first_name: ''}}, headers: headers(user)
      end.to_not change{user.reload}

      expect(response.status).to eq 422
      expect(json).to eq ({'error' => {'first_name' => ['can\'t be blank']}})
    end
  end

  describe 'Post /sign_in' do
    it 'should return error if email or password missing' do
      post '/api/v1/sign-in', params: {email: 'test@test.com', password: ''}

      expect(response.status).to eq 401
      expect(json).to eq ({'error' => ['Email or password can not be blank']})
    end

    it 'should return error if archived user' do
      archived_user = create(:user, archived: true, email: 'archived@test.com', password: '12345678')
      post '/api/v1/sign-in', params: {email: 'archived@test.com', password: '12345678'}

      expect(response.status).to eq 401
      expect(json).to eq ({'error' => ['You don\'t have the permission!']})
    end

    it 'should call JsonWebToken and render json' do
      user
      expect(Api::V1::UserSerializer).to receive_message_chain(:new, :to_custom_hash).and_return('test')
      expect(JsonWebToken).to receive(:encode).and_return('tttttoken')
      post '/api/v1/sign-in', params: {email: 'test@test.com', password: '12345678'}

      expect(response).to be_successful
      expect(json).to eq ({'auth_token' => 'tttttoken', 'remember_me' => nil, 'user' => 'test'})
    end

    it 'should return error if invalid email and password' do
      user
      expect(JsonWebToken).to_not receive(:encode)
      post '/api/v1/sign-in', params: {email: 'test@test.com', password: '12345677'}

      expect(response.status).to eq 401
      expect(json).to eq ({'error' => ['Invalid Email or Password']})
    end
  end

  describe 'Get /user-info' do
    it 'should render json' do
      get '/api/v1/user-info', headers: headers(admin_user)

      expect(response).to be_successful
      expect(json['id']).to eq admin_user.id
      expect(json['first_name']).to eq admin_user.first_name
      expect(json['last_name']).to eq admin_user.last_name
      expect(json['full_name']).to eq admin_user.full_name
      expect(json['email']).to eq admin_user.email
      expect(json['avatar_url']).to eq admin_user.avatar_url
      expect(json['role']).to eq admin_user.role
      expect(json['archived']).to eq '0'
      expect(json['errors']).to eq ({})
      expect(json['assigned_jobs_count']).to eq 0
      expect(json['assigned_active_jobs_count']).to eq 0
      expect(json['assigned_failed_jobs_count']).to eq 0
      expect(json['assigned_finished_jobs_count']).to eq 0
    end
  end

  describe 'Get /users-collection' do
    it 'should render json' do
      expect(User).to receive_message_chain(:unarchived, :with_attached_avatar).and_return([user, admin_user])
      get '/api/v1/users-collection', headers: headers(admin_user)

      expect(response).to be_successful
      expect(json['users'].count).to eq 2
      expect(json['users'].first['id']).to eq user.id
      expect(json['users'].first['first_name']).to eq user.first_name
      expect(json['users'].first['last_name']).to eq user.last_name
      expect(json['users'].first['full_name']).to eq user.full_name
      expect(json['users'].first['email']).to eq user.email
      expect(json['users'].first['avatar_url']).to eq user.avatar_url
      expect(json['users'].first['role']).to eq user.role
      expect(json['users'].first['archived']).to eq '0'
      expect(json['users'].first['errors']).to eq ({})
      expect(json['users'].first['assigned_jobs_count']).to eq 0
      expect(json['users'].first['assigned_active_jobs_count']).to eq 0
      expect(json['users'].first['assigned_failed_jobs_count']).to eq 0
      expect(json['users'].first['assigned_finished_jobs_count']).to eq 0

      expect(json['users'].last['id']).to eq admin_user.id
      expect(json['users'].last['first_name']).to eq admin_user.first_name
      expect(json['users'].last['last_name']).to eq admin_user.last_name
      expect(json['users'].last['full_name']).to eq admin_user.full_name
      expect(json['users'].last['email']).to eq admin_user.email
      expect(json['users'].last['avatar_url']).to eq admin_user.avatar_url
      expect(json['users'].last['role']).to eq admin_user.role
      expect(json['users'].last['archived']).to eq '0'
      expect(json['users'].last['errors']).to eq ({})
      expect(json['users'].last['assigned_jobs_count']).to eq 0
      expect(json['users'].last['assigned_active_jobs_count']).to eq 0
      expect(json['users'].last['assigned_failed_jobs_count']).to eq 0
      expect(json['users'].last['assigned_finished_jobs_count']).to eq 0
    end
  end
end
