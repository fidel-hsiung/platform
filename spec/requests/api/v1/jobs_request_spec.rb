require 'rails_helper'

RSpec.describe 'Api::V1::Jobs', type: :request do

  let(:job) {create(:job_with_users)}
  let(:admin_user) {create(:admin_user)}

  describe 'Jobs List' do
    before do
      @jobs = []
      (0..4).each do |i|
        @jobs[i] = create(:job_with_users)
      end
      @jobs[1].update_columns(start_date: Date.parse('2020-06-04'), end_date: Date.parse('2020-06-05'), status: 'finished')
      @jobs[2].update_columns(name: 'ggggg111', start_date: Date.current, status: 'active')
      @jobs[3].update_columns(start_date: Date.parse('2020-05-26'), end_date: Date.parse('2020-05-30'), status: 'failed')
      @jobs[4].update_columns(name: 'ggggg222', start_date: Date.current - 3.days, end_date: Date.current - 1.day, status: 'finished')
    end

    describe 'Get /jobs' do
      it 'should render json' do
        temp = double()
        expect(JobFilter).to receive(:new).with(name: nil, job_number: nil, statuses: [], start_date: '', end_date: '', attendee_ids: [], creator_ids: []).and_return(temp)
        expect(temp).to receive(:result).and_return(Job.includes(users: {avatar_attachment: :blob}).left_joins(:user_jobs).distinct)

        get '/api/v1/jobs', params: {page: '1', sort_by: 'id', sort_method: 'desc'}, headers: headers

        expect(response).to be_successful
        expect(json['jobs'].count).to eq 5
        expect(json['jobs'].map{|job| job['id']}).to eq [@jobs[4].id, @jobs[3].id, @jobs[2].id, @jobs[1].id, @jobs[0].id]
        expect(json['total_pages']).to eq 1
      end
    end

    describe 'Get /calendar-jobs' do
      it 'should return error' do
        get '/api/v1/calendar-jobs', headers: headers

        expect(response.status).to eq 422
        expect(json).to eq ({'error' => ['Date cannot be blank!']})
      end

      it 'should rescue from StandardError and return error' do
        get '/api/v1/calendar-jobs', params: {calendar_day: 'test'}, headers: headers

        expect(response.status).to eq 500
        expect(json).to eq ({'error' => ['Sorry something went wrong.']})
      end

      it 'should render json' do
        get '/api/v1/calendar-jobs', params: {calendar_day: '2020-05-25'}, headers: headers

        expect(response).to be_successful
        expect(json['jobs'].count).to eq 1
        expect(json['jobs'].first['id']).to eq @jobs[3].id
        expect(json['jobs'].first['job_number']).to eq @jobs[3].job_number
        expect(json['jobs'].first['name']).to eq @jobs[3].name
        expect(json['jobs'].first['location']).to eq @jobs[3].location
        expect(json['jobs'].first['body']).to eq @jobs[3].body
        expect(json['jobs'].first['status']).to eq @jobs[3].status
        expect(json['jobs'].first['start_date']).to eq @jobs[3].start_date.to_s
        expect(json['jobs'].first['end_date']).to eq @jobs[3].end_date.to_s
        expect(json['jobs'].first['users']).to eq []
        expect(json['jobs'].first['users_count']).to eq 0
        expect(json['jobs'].first['user_jobs_attributes']).to eq []
        expect(json['jobs'].first['user_ids']).to eq []
        expect(json['calendar_dates']).to eq ({'start_date' => '2020-04-27', 'end_date' => '2020-05-31'})
      end
    end

    describe 'Get /day-jobs' do
      it 'should render json' do
        get '/api/v1/day-jobs', headers: headers

        expect(response).to be_successful
        expect(json['jobs'].count).to eq 1
        expect(json['jobs'].first['id']).to eq @jobs[2].id
        expect(json['jobs'].first['job_number']).to eq @jobs[2].job_number
        expect(json['jobs'].first['name']).to eq @jobs[2].name
        expect(json['jobs'].first['location']).to eq @jobs[2].location
        expect(json['jobs'].first['body']).to eq @jobs[2].body
        expect(json['jobs'].first['status']).to eq @jobs[2].status
        expect(json['jobs'].first['start_date']).to eq @jobs[2].start_date.to_s
        expect(json['jobs'].first['end_date']).to eq @jobs[2].end_date.to_s
        expect(json['jobs'].first['users'].count).to eq @jobs[2].users.size
        expect(json['jobs'].first['users'].first['id']).to eq @jobs[2].users.first.id
        expect(json['jobs'].first['users_count']).to eq @jobs[2].users.size
        expect(json['jobs'].first['user_jobs_attributes']).to eq []
        expect(json['jobs'].first['user_ids']).to eq @jobs[2].users.ids
        expect(json['day']).to eq Date.current.to_s
      end

      it 'should render json' do
        get '/api/v1/day-jobs', params: {day: '2020-06-04'}, headers: headers

        expect(response).to be_successful
        expect(json['jobs'].count).to eq 1
        expect(json['jobs'].first['id']).to eq @jobs[1].id
        expect(json['jobs'].first['job_number']).to eq @jobs[1].job_number
        expect(json['jobs'].first['name']).to eq @jobs[1].name
        expect(json['jobs'].first['location']).to eq @jobs[1].location
        expect(json['jobs'].first['body']).to eq @jobs[1].body
        expect(json['jobs'].first['status']).to eq @jobs[1].status
        expect(json['jobs'].first['start_date']).to eq @jobs[1].start_date.to_s
        expect(json['jobs'].first['end_date']).to eq @jobs[1].end_date.to_s
        expect(json['jobs'].first['users'].count).to eq @jobs[1].users.size
        expect(json['jobs'].first['users'].first['id']).to eq @jobs[1].users.first.id
        expect(json['jobs'].first['users_count']).to eq @jobs[1].users.size
        expect(json['jobs'].first['user_jobs_attributes']).to eq []
        expect(json['jobs'].first['user_ids']).to eq @jobs[1].users.ids
        expect(json['day']).to eq '2020-06-04'
      end
    end
  end

  describe 'Get /jobs/:id' do
    it 'should render json' do
      get "/api/v1/jobs/#{job.id}", headers: headers

      expect(response).to be_successful
      expect(json['id']).to eq job.id
      expect(json['job_number']).to eq job.job_number
      expect(json['name']).to eq job.name
      expect(json['location']).to eq job.location
      expect(json['body']).to eq job.body
      expect(json['status']).to eq job.status
      expect(json['start_date']).to eq job.start_date.to_s
      expect(json['end_date']).to eq job.end_date.to_s
      expect(json['users'].count).to eq job.users.size
      expect(json['users'].first['id']).to eq job.users.first.id
      expect(json['users_count']).to eq job.users.size
      expect(json['user_jobs_attributes']).to eq []
      expect(json['user_ids']).to eq job.users.ids
    end
  end

  describe 'Get /jobs/:id/edit' do
    it 'should render json' do
      get "/api/v1/jobs/#{job.id}/edit", headers: headers

      expect(response).to be_successful
      expect(json['id']).to eq job.id
      expect(json['job_number']).to eq job.job_number
      expect(json['name']).to eq job.name
      expect(json['location']).to eq job.location
      expect(json['body']).to eq job.body
      expect(json['status']).to eq job.status
      expect(json['start_date']).to eq job.start_date.to_s
      expect(json['end_date']).to eq job.end_date.to_s
      expect(json['users']).to eq []
      expect(json['users_count']).to eq 0
      expect(json['user_jobs_attributes'].count).to eq job.user_jobs.count
      expect(json['user_jobs_attributes'].first['id']).to eq job.user_jobs.first.id
      expect(json['user_ids']).to eq job.users.ids
    end

    it 'should rescue from not found and return error' do
      get '/api/v1/jobs/0/edit', headers: headers

      expect(response.status).to eq 404
      expect(json).to eq ({'error' => ['Could not find the object.']})
    end
  end

  describe 'Post /jobs' do
    it 'should return error if not admin user' do
      post '/api/v1/jobs', params: {job: FactoryBot.attributes_for(:job_with_users)}, headers: headers

      expect(response.status).to eq 401
      expect(json).to eq ({'error' => ['You don\'t have the permission!']})
    end

    it 'should call ActionCable and render json' do
      expect(Api::V1::JobSerializer).to receive_message_chain(:new, :to_custom_hash).and_return({test: 'test'})
      expect(ActionCable.server).to receive(:broadcast).with('jobs_channel', {job: {test: 'test'}, user_id: admin_user.id})
      post '/api/v1/jobs', params: {job: FactoryBot.attributes_for(:job_with_users)}, headers: headers(admin_user)

      expect(response).to be_successful
      expect(json).to eq ({'test' => 'test'})
    end

    it 'should error with invalid params' do
      expect(ActionCable.server).to_not receive(:broadcast)
      post '/api/v1/jobs', params: {job: FactoryBot.attributes_for(:job_with_users, name: '')}, headers: headers(admin_user)

      expect(response.status).to eq 422
      expect(json).to eq ({'error' => {'name' => ['can\'t be blank']}})
    end
  end

  describe 'Put /jobs/:id' do
    it 'should return error if not admin user' do
      put "/api/v1/jobs/#{job.id}", params: {job: {name: 'Test Name'}}, headers: headers

      expect(response.status).to eq 401
      expect(json).to eq ({'error' => ['You don\'t have the permission!']})
    end

    it 'should update job, call ActionCable and render json' do
      expect(Api::V1::JobSerializer).to receive_message_chain(:new, :to_custom_hash).and_return({test: 'test'})
      expect(ActionCable.server).to receive(:broadcast).with('jobs_channel', {job: {test: 'test'}, user_id: admin_user.id})
      expect do
        put "/api/v1/jobs/#{job.id}", params: {job: {name: 'Test Name'}}, headers: headers(admin_user)
      end.to change{job.reload.name}.to('Test Name')

      expect(response).to be_successful
      expect(json).to eq ({'test' => 'test'})
    end

    it 'should not update job and return error with invalid params' do
      expect(ActionCable.server).to_not receive(:broadcast)
      expect do
        put "/api/v1/jobs/#{job.id}", params: {job: {name: ''}}, headers: headers(admin_user)
      end.to_not change{job.reload}

      expect(response.status).to eq 422
      expect(json).to eq ({'error' => {'name' => ['can\'t be blank']}})
    end

    it 'should rescue from exception and return error' do
      expect(Job).to receive(:find).and_raise(Exception.new('test'))

      put "/api/v1/jobs/#{job.id}", params: {job: {name: 'Test Name'}}, headers: headers(admin_user)

      expect(response.status).to eq 500
      expect(json).to eq ({'error' => ['Server error.']})
    end
  end
end
