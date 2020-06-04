class Api::V1::BaseController < ActionController::API
  include AbstractController::Rendering
  include ActionController::Rendering
  include ActionController::Renderers::All
  include ActionController::BasicImplicitRender
  include ActionController::DataStreaming
  include AbstractController::Callbacks
  include ActionController::Rescue
  include ActionController::Instrumentation
  include ActionController::ParamsWrapper
  include ActionController::Head

  before_action :authenticate!
  before_action :load_data
  before_action :set_host_for_local_storage


  rescue_from Exception do |exception|
    if Rails.env.in? %w(staging production)
      ExceptionNotifier.notify_exception(exception, env: request.env)
    else
      p "------ Error: "
      p ">>>>>> #{exception.inspect} <<<<<<"
      p "------"
    end
    error!({error: ['Server error.']}, 500)
  end

  rescue_from StandardError do |error|
    if Rails.env.in? %w(staging production)
      ExceptionNotifier.notify_exception(error, env: request.env)
    else
      p "------ Error: "
      p ">>>>>> #{error.inspect} <<<<<<"
      p "------"
    end
    error!({error: ['Sorry something went wrong.']}, 500)
  end

  rescue_from ActiveRecord::RecordNotFound do |error|
    error!({error: ['Could not find the object.']}, 404)
  end

  protected

  def current_user
    return @current_user unless @current_user.nil?
    decoded_auth_token = JsonWebToken.decode(request.env['HTTP_X_USER_AUTH_TOKEN'])
    @current_user = User.find_by_id(decoded_auth_token[:user_id]) if decoded_auth_token
    @current_user
  end

  def error!(message, _status = 500)
    self.response_body = message.to_json
    self.status = _status
  end

  private

  def authenticate!
    return error!({error: ['Please login or signup']}, 401) unless current_user.present?
    return error!({error: ["You don't have the permission!"]}, 401) if current_user.archived?
  end

  def load_data
    self.content_type = 'application/json'
  end

  def set_host_for_local_storage
    ActiveStorage::Current.host = request.base_url unless Rails.application.config.active_storage.service == :amazon
  end
end
