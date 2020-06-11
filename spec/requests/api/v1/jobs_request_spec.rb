require 'rails_helper'

RSpec.describe 'Api::V1::Jobs', type: :request do

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

end
