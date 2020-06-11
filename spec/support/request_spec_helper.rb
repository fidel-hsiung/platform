module RequestSpecHelper

  def json
    JSON.parse(response.body)
  end

  def headers(user = nil)
    temp_user = user || create(:user)
    {'HTTP_X_USER_AUTH_TOKEN' => JsonWebToken.encode({user_id: temp_user.id}, 10.minutes.from_now)}
  end
end
