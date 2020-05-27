class Api::V1::UserJobSerializer < Api::V1::BaseSerializer

  attributes :id, :user_id, :job_id, :_destroy
end
