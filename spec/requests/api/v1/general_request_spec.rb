require 'rails_helper'

RSpec.describe 'Api::V1::Generals', type: :request do

  describe 'Get invalid url' do
    it 'should return error' do
      get '/api/v1/invalid-url', headers: headers

      expect(response.status).to eq 500
      expect(json).to eq ({'error' => ['Invalid url!']})
    end
  end
end
