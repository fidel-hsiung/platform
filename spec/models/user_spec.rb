require 'rails_helper'

RSpec.describe User, type: :model do

  let(:user) {create(:user, first_name: 'Harry', last_name: 'Potter')}

  context 'attachment methods' do
    describe '#avatar_url' do
      it 'should return default_url if not attached' do
        expect(user.avatar_url).to include '/media/images/default-user'
      end

      it 'should return avatar_url' do
        ActiveStorage::Current.host = 'http://www.example.com'
        user_with_avatar = create(:user, avatar: fixture_file_upload('/images/sunset.jpg', 'image/jpg'))
        expect(user_with_avatar.avatar_url).to include 'sunset.jpg'
      end
    end

    describe '#check_avatar' do
      it 'should error if not image' do
        user = User.new(FactoryBot.attributes_for(:user, avatar: fixture_file_upload('/videos/sample_video.mp4', 'video/mp4')))
        expect(user.save).to eq false
        expect(user.errors[:avatar]).to eq ['not a valid image format']
      end
    end
  end


  describe '#full_name' do
    it 'should return full name' do
      expect(user.full_name).to eq 'Harry Potter'
    end
  end

  describe '#downcase_email' do
    it 'should return full name' do
      user.update(email: 'TeSt@Gmail.COM')
      expect(user.email).to eq 'test@gmail.com'
    end
  end

  describe '#format_names' do
    it 'should return full name' do
      user.update(first_name: 'william', last_name: 'michale')
      expect(user.first_name).to eq 'William'
      expect(user.last_name).to eq 'Michale'
    end
  end

end
