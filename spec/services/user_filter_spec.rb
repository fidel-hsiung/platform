require 'rails_helper'

describe UserFilter do

  describe '#result' do
    it 'should return result' do
      user1 = create(:user, email: 'aaa@test.com', first_name: 'joe', last_name: 'ellis', role: 'admin', archived: true)
      user2 = create(:user, email: 'ddd@test.com', first_name: 'jie', last_name: 'armstrong', role: 'contractor', archived: false)
      user3 = create(:user, email: 'aab@test.com', first_name: 'wilaaa', last_name: 'ruen', role: 'admin', archived: false)
      user4 = create(:user, email: 'acs@test.com', first_name: 'wiaaa', last_name: 'ellaa', role: 'employee', archived: true)
      user5 = create(:user, email: 'eee@test.com', first_name: 'michale', last_name: 'armsbbb', role: 'employee', archived: false)

      expect(UserFilter.new(email: 'AA').result).to eq [user1, user3]

      expect(UserFilter.new(first_name: 'wi').result).to eq [user3, user4]

      expect(UserFilter.new(last_name: 'arms').result).to eq [user2, user5]

      expect(UserFilter.new(roles: ['admin', 'employee']).result).to eq [user1, user3, user4, user5]

      expect(UserFilter.new(archived: '1').result).to eq [user1, user4]
    end
  end
end