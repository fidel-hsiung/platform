require 'rails_helper'

RSpec.describe "Pages", type: :request do

  describe "Get '/'" do
    it "should load resources and render template" do
      get '/'

      expect(response).to have_http_status(:success)
      expect(response).to render_template :home
    end
  end
end
