require "rails_helper"

RSpec.describe SystemMailer, type: :mailer do

  before do
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.deliveries = []
  end

  after do
    ActionMailer::Base.deliveries.clear
  end

  describe '#welcome_user' do
    let(:mail) { SystemMailer.welcome_user('Harry Potter', 'harry_potter@platform.com', '12345678') }

    it 'should send welcome email' do
      expect(mail.subject).to eq('Welcome to Platform')
      expect(mail.to).to eq(['harry_potter@platform.com'])
      expect(mail.from).to eq(['support@platform.com'])
      expect(mail.body.encoded).to include 'Harry Potter'
      expect(mail.body.encoded).to include '12345678'
      expect{
        mail.deliver
      }.to change(ActionMailer::Base.deliveries, :count).by(1)
    end
  end
end
