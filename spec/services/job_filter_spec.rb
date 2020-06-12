require 'rails_helper'

describe JobFilter do

  describe '#result' do
    it 'should return result' do
      admin_user1 = create(:admin_user)
      admin_user2 = create(:admin_user)
      admin_user3 = create(:admin_user)

      user1 = create(:user)
      user2 = create(:user)
      user3 = create(:user)

      job1 = create(:job, user: admin_user2, name: 'joe', job_number: 'platform-000001', status: 'active')
      job1.update_columns(start_date: Date.parse('2020-06-04'), end_date: Date.parse('2020-06-05'))
      create(:user_job, user: user1, job: job1)
      create(:user_job, user: user3, job: job1)

      job2 = create(:job, user: admin_user1, name: 'jie', job_number: 'platform-000002', status: 'pending')
      job2.update_columns(start_date: Date.current, end_date: Date.current)
      create(:user_job, user: user2, job: job2)

      job3 = create(:job, user: admin_user3, name: 'wilaaa', job_number: 'platform-000003', status: 'failed')
      job3.update_columns(start_date: Date.parse('2020-05-26'), end_date: Date.parse('2020-05-30'))
      create(:user_job, user: user1, job: job3)
      create(:user_job, user: user2, job: job3)
      create(:user_job, user: user3, job: job3)

      job4 = create(:job, user: admin_user3, name: 'wiaaa', job_number: 'platform-000004', status: 'active')
      job4.update_columns(start_date: Date.current - 3.days, end_date: Date.current - 1.day)
      create(:user_job, user: user2, job: job4)
      create(:user_job, user: user3, job: job4)

      job5 = create(:job, user: admin_user1, name: 'michale', job_number: 'platform-000005', status: 'finished')
      create(:user_job, user: user1, job: job5)
      create(:user_job, user: user2, job: job5)


      expect(JobFilter.new(name: 'wi').result.order('jobs.id')).to eq [job3, job4]

      expect(JobFilter.new(job_number: 'platform-000001').result.order('jobs.id')).to eq [job1]

      expect(JobFilter.new(statuses: ['pending', 'active']).result.order('jobs.id')).to eq [job1, job2, job4]

      expect(JobFilter.new(start_date: Date.current, end_date: Date.current + 2.days).result.order('jobs.id')).to eq [job2, job5]
      expect(JobFilter.new(start_date: Date.current - 3.days).result.order('jobs.id')).to eq [job2, job4, job5]
      expect(JobFilter.new(end_date: Date.current - 4.days).result.order('jobs.id')).to eq [job1, job3]

      expect(JobFilter.new(attendee_ids: [user1.id, user3.id]).result.order('jobs.id')).to eq [job1, job3, job4, job5]

      expect(JobFilter.new(creator_ids: [admin_user2.id, admin_user3.id]).result.order('jobs.id')).to eq [job1, job3, job4]
    end
  end
end