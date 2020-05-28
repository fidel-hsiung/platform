class Api::V1::UserJobSerializer < Api::V1::BaseSerializer

  attributes :id, :user_id, :job_id, :_destroy

  attribute :user_avatar_url do |user_job|
    user_job.user.avatar_url
  end

  attribute :user_full_name do |user_job|
    user_job.user.full_name
  end

  attribute :errors do |user_job, params|
    params[:include_errors] ? user_job.errors.to_h : {}
  end
end
