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
  end

  def load_data
    self.content_type = 'application/json'
  end
end
