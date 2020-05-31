# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user1 = User.create(first_name: 'William', last_name: 'Ellis', email: 'william.ellis@test.com', password: '12345678', role: 'employee', archived: true)
user2 = User.create(first_name: 'Ruben', last_name: 'Saunders', email: 'ruben.saunders@test.com', password: '12345678', role: 'employee')
user3 = User.create(first_name: 'Euan', last_name: 'Bradley', email: 'euan.bradley@test.com', password: '12345678', role: 'employee')
user4 = User.create(first_name: 'Tomas', last_name: 'Armstrong', email: 'tomas.armstrong@test.com', password: '12345678', role: 'employee')
user5 = User.create(first_name: 'Hunter', last_name: 'Gallagher', email: 'hunter.gallagher@test.com', password: '12345678', role: 'contract')
user6 = User.create(first_name: 'Ralph', last_name: 'James', email: 'ralph.james@test.com', password: '12345678', role: 'contract')
user7 = User.create(first_name: 'Aydin', last_name: 'George', email: 'aydin.george@test.com', password: '12345678', role: 'contract')
user8 = User.create(first_name: 'Miles', last_name: 'Read', email: 'miles.read@test.com', password: '12345678', role: 'contract')

admin1 = User.create(first_name: 'Brodie', last_name: 'Armstrong', email: 'brodie.armstrong@test.com', password: '12345678', role: 'admin')
admin2 = User.create(first_name: 'Brooklyn', last_name: 'Burton', email: 'brooklyn.burton@test.com', password: '12345678', role: 'admin')

job1 = Job.create(user: admin1, name: 'Test job 1', body: 'Test body 1', job_number: 'Platform-job-0000', location: 'Adelaide Scuba, 3 Patawalonga Frontage, Glenelg SA')
job1.update_columns(start_date: Date.current + 2.days, end_date: Date.current + 24.days, status: 'active')
UserJob.create(user: user1, job: job1)
UserJob.create(user: user2, job: job1)
UserJob.create(user: user4, job: job1)
UserJob.create(user: user7, job: job1)

job2 = Job.create(user: admin1, name: 'Test job 2', body: 'Test body 2', job_number: 'Platform-job-0001', location: 'Adelaide Aquatic Centre, Jeffcott Road, North Adelaide SA')
job2.update_columns(start_date: Date.current - 2.days, end_date: Date.current + 4.days, status: 'active')
UserJob.create(user: user2, job: job2)
UserJob.create(user: user3, job: job2)
UserJob.create(user: user5, job: job2)
UserJob.create(user: user7, job: job2)
UserJob.create(user: user8, job: job2)

job3 = Job.create(user: admin1, name: 'Test job 3', body: 'Test body 3', job_number: 'Platform-job-0002', location: 'Kent Town Swim, Kent Town SA')
job3.update_columns(start_date: Date.current - 5.days, end_date: Date.current - 1.day, status: 'finished')
UserJob.create(user: user1, job: job3)
UserJob.create(user: user4, job: job3)
UserJob.create(user: user5, job: job3)
UserJob.create(user: user6, job: job3)
UserJob.create(user: user7, job: job3)

job4 = Job.create(user: admin2, name: 'Test job 4', body: 'Test body 4', job_number: 'Platform-job-0003', location: 'Norwood Swimming Centre, Phillips Street, Kensington SA')
job4.update_columns(start_date: Date.current - 7.days, end_date: Date.current + 3.days, status: 'failed')
UserJob.create(user: user2, job: job4)
UserJob.create(user: user3, job: job4)
UserJob.create(user: user4, job: job4)
UserJob.create(user: user8, job: job4)

job5 = Job.create(user: admin2, name: 'Test job 5', body: 'Test body 5', job_number: 'Platform-job-0004', location: 'Payneham Swimming Centre, O G Road, Felixstow SA')
job5.update_columns(start_date: Date.current - 4.days, end_date: Date.current + 1.day, status: 'finished')
UserJob.create(user: user1, job: job5)
UserJob.create(user: user2, job: job5)
UserJob.create(user: user6, job: job5)
UserJob.create(user: user7, job: job5)

job6 = Job.create(user: admin2, name: 'Test job 6', body: 'Test body 6', job_number: 'Platform-job-0005', location: 'The ARC Campbelltown, Lower North East Road, Campbelltown SA')
job6.update_columns(start_date: Date.current - 10.days, end_date: Date.current - 2.days, status: 'failed')
UserJob.create(user: user2, job: job6)
UserJob.create(user: user3, job: job6)
UserJob.create(user: user4, job: job6)
UserJob.create(user: user5, job: job6)
UserJob.create(user: user6, job: job6)
UserJob.create(user: user7, job: job6)

jobs = []
statuses = %w(pending active finished failed)

50.times do |i|
  jobs[i] = Job.create(user: admin1, name: "Test previous job #{i+1}", body: 'Test body, Test body, Test body, Test body, Test body', job_number: "Platform-previous-job-#{i+1}", location: 'The ARC Campbelltown, Lower North East Road, Campbelltown SA')
  jobs[i].update_columns(start_date: Date.current - (i + 2).days, end_date: Date.current - i.days, status: statuses[i%4])
end