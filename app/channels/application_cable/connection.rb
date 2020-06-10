module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
      logger.add_tags 'ActionCable Connected', "User: #{current_user.full_name}"
    end

    def disconnect
    end

    protected
    def find_verified_user
      if request.params[:token].present?
        decoded_auth_token = JsonWebToken.decode(request.params[:token])
        if decoded_auth_token
          verified_user = User.find_by_id(decoded_auth_token[:user_id])
          return verified_user if verified_user
        end
      end
      reject_unauthorized_connection
    end
  end
end
