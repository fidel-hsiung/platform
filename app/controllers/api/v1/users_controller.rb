class Api::V1::UsersController < Api::V1::BaseController
	skip_before_action :authenticate!, only: [:create, :sign_in, :reset_password]

	def sign_in
    return error!({error: ['Email or password can not be blank']}, 401) if params[:email].blank? || params[:password].blank?
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      return error!({error: ["You don't have the permission!"]}, 401) if user.archived?
    	exp = params[:remember_me] ? 30.days.from_now : 6.hours.from_now
      render json: {auth_token: JsonWebToken.encode({user_id: user.id}, exp), remember_me: params[:remember_me], user: Api::V1::UserSerializer.new(user).to_custom_hash}
    else
      error!({error: ['Invalid Email or Password']}, 401)
    end
	end

  def user_info
    render json: Api::V1::UserSerializer.new(current_user).to_custom_hash
  end

  def users_collection
    users = User.unarchived.with_attached_avatar
    render json: {users: Api::V1::UserSerializer.new(users).to_custom_hash}
  end
end