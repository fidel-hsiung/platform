# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.create(first_name: 'Harry', last_name: 'Potter', email: 'harry.potter@test.com', password: '12345678', role: 'employee')

User.create(first_name: 'John', last_name: 'Doe', email: 'john.doe@test.com', password: '12345678', role: 'admin')
