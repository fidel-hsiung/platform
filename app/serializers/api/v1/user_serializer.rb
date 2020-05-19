class Api::V1::UserSerializer < Api::V1::BaseSerializer

  set_type :role

  attributes :first_name, :last_name, :email, :avatar_url
end
