class Api::V1::JobsController < Api::V1::BaseController

	def index
	end

	def calendar_jobs
    return error!({error: ['Date cannot be blank!']}, 422) unless params[:calendar_day].present?
    calendar_day = params[:calendar_day].to_date
    jobs = Job.calendar(calendar_day)

    render json: {jobs: Api::V1::JobSerializer.new(jobs).to_custom_hash}
	end
end
