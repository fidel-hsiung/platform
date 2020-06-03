class Api::V1::UserSerializer < Api::V1::BaseSerializer

  set_type :role

  attributes :id, :first_name, :last_name, :full_name, :email, :avatar_url, :role

  attribute :archived do |user|
    user.archived? ? '1' : '0'
  end

  attribute :errors do |user, params|
    params[:include_errors] ? user.errors.to_h : {}
  end

  attribute :assigned_jobs_count do |user, params|
    if params[:include_jobs]
      user.assigned_jobs.size
    end
  end

  attribute :assigned_active_jobs_count do |user, params|
    if params[:include_jobs]
      user.assigned_jobs.select(&:active?).size
    end
  end

  attribute :assigned_failed_jobs_count do |user, params|
    if params[:include_jobs]
      user.assigned_jobs.select(&:failed?).size
    end
  end

  attribute :assigned_finished_jobs_count do |user, params|
    if params[:include_jobs]
      user.assigned_jobs.select(&:finished?).size
    end
  end
end
