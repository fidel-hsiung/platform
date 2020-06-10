class UsersChannel < ApplicationCable::Channel
  def subscribed
    stream_from "users_channel"
  end
end
