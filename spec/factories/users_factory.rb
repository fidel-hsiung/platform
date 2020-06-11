FactoryBot.define do
  factory :user do
    first_name               {Faker::Name.first_name}
    last_name                {Faker::Name.last_name}
    email                    {Faker::Internet.email}
    password                 {Faker::Internet.password}
    role                     {'employee'}

    factory :user_with_avatar do
      avatar                 {fixture_file_upload('/images/sunset.jpg', 'image/jpg')}
    end

    factory :admin_user do
      role                   {'admin'}
    end
  end
end
