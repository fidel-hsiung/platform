class Api::V1::JobSerializer < Api::V1::BaseSerializer

  attributes :id, :job_number, :name, :location, :body, :status, :start_date, :end_date

  attribute :errors do |job, params|
  	params[:include_errors] ? job.errors.to_h : {}
  end

  attribute :users do |job, params|
  	if params[:include_users]
  		Api::V1::UserSerializer.new(job.users).to_custom_hash
  	else
  		[]
  	end
  end

  attribute :users_count do |job, params|
    if params[:include_users]
      job.users.size
    else
      0
    end
  end

  attributes :user_jobs_attributes do |job, params|
  	if params[:include_user_jobs_attributes]
  		Api::V1::UserJobSerializer.new(job.user_jobs).to_custom_hash
  	else
  		[]
  	end
  end

  attributes :user_ids do |job, params|
    if params[:include_user_jobs_attributes] || params[:include_users]
      job.users.ids
    else
      []
    end
  end
end
