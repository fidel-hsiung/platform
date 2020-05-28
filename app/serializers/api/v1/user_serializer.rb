class Api::V1::UserSerializer < Api::V1::BaseSerializer

  set_type :role

  attributes :id, :first_name, :last_name, :full_name, :email, :avatar_url, :role
end
