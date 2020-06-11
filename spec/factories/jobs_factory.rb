FactoryBot.define do
  factory :job do
    user_id               {create(:admin_user).id}
    sequence(:job_number) {|n| "platform-00000#{n}"}
    name                  {Faker::Job.title}
    location              {Faker::Address.full_address}
    start_date            {Date.current+2.days}
    end_date              {Date.current+4.days}
    body                  {Faker::Games::Dota.quote}


    factory :job_with_users do
      user_jobs_attributes {[{user_id: create(:user).id, _destroy: false}]}
    end

    factory :pending_job do
      status              {'pending'}
    end

    factory :active_job do
      status              {'active'}
    end

    factory :finished_job do
      status              {'finished'}
    end

    factory :failed_job do
      status              {'failed'}
    end
  end
end
