require "rails_helper"

RSpec.describe ApplicationCable::Connection, :type => :channel do

  let(:user) {create(:user)}

  it 'rejects connects' do
    expect { connect '/cable' }.to have_rejected_connection
  end

  it 'rejects connects' do
    expect { connect '/cable?token=123' }.to have_rejected_connection
  end

  it 'successfully connects' do
    connect "/cable?token=#{JsonWebToken.encode({user_id: user.id}, 10.minutes.from_now)}"
  end
end
