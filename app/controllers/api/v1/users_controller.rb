class Api::V1::UsersController < Api::V1::BaseController
  skip_before_action :authenticate!, only: [:create, :sign_in, :reset_password]
  before_action :check_permission, only: [:create]

  def index
    roles = params[:roles].present? ? params[:roles].select(&:present?) : []

    users = UserFilter.new({
      email: params[:email],
      first_name: params[:first_name],
      last_name: params[:last_name],
      roles: roles,
      archived: params[:archived]
    }).result

    sort_by = params[:sort_by].in?(%w(id email first_name role archived)) ? params[:sort_by] : 'id'
    sort_method = params[:sort_method].in?(%w(asc desc)) ? params[:sort_method] : 'asc'
    current_page = params[:page].present? ? params[:page].to_i : 1

    sorted_users = users.order(Arel.sql("#{params[:sort_by]} #{params[:sort_method]}")).page(current_page)
    total_pages = sorted_users.total_pages

    render json: {users: Api::V1::UserSerializer.new(sorted_users).to_custom_hash, total_pages: total_pages}
  end

  def create
    generated_password = 8.times.map{rand(9)}.join
    user = User.new(user_params.merge(password: generated_password, password_confirmation: generated_password))
    if user.save
      SystemMailer.welcome_user(user.full_name, user.email, generated_password).deliver_later
      ActionCable.server.broadcast('users_channel', {action_type: 'create'})
      render json: Api::V1::UserSerializer.new(user).to_custom_hash
    else
      error!({error: user.errors}, 422)
    end
  end

  def show
    user = User.includes(:assigned_jobs).with_attached_avatar.find(params[:id])

    render json: Api::V1::UserSerializer.new(user, params: {include_jobs: true}).to_custom_hash
  end

  def update
    return error!({error: ["You don't have the permission!"]}, 401) unless current_user.admin? || current_user.id == params[:id].to_i
    user = User.find(params[:id])
    if user.update(user_params)
      ActionCable.server.broadcast('users_channel', {action_type: 'update'})
      render json: Api::V1::UserSerializer.new(user).to_custom_hash
    else
      error!({error: user.errors}, 422)
    end
  end

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

  private

  def user_params
    params.require(:user).permit(:email, :first_name, :last_name, :role, :archived, :avatar, :password, :password_confirmation)
  end
end