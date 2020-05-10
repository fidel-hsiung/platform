class Api::V1::UserSerializer
  include FastJsonapi::ObjectSerializer

  set_id :id
  set_type :role
  attributes :first_name, :last_name, :email, :avatar_url
end
