class Api::V1::JobsController < Api::V1::BaseController

  def index
  end

	def calendar_jobs
    return error!({error: ['Date cannot be blank!']}, 422) unless params[:calendar_day].present?
    calendar_day = params[:calendar_day].to_date
    jobs = Job.calendar(calendar_day)

    render json: {jobs: Api::V1::JobSerializer.new(jobs).to_custom_hash, calendar_dates: {start_date: calendar_day.beginning_of_month.beginning_of_week, end_date: calendar_day.end_of_month.end_of_week}}
	end

  def day_jobs
    day = params[:day].present? ? params[:day].to_date : Date.current
    jobs = Job.includes(users: {avatar_attachment: :blob}).with_in_day(day)

    render json: {jobs: Api::V1::JobSerializer.new(jobs, params: {include_users: true}).to_custom_hash, day: day}
  end

	def show
		job = Job.includes(users: {avatar_attachment: :blob}).find(params[:id])
		render json: Api::V1::JobSerializer.new(job, params: {include_users: true}).to_custom_hash
	end

	def edit
		job = Job.includes(users: {avatar_attachment: :blob}).find(params[:id])
		render json: Api::V1::JobSerializer.new(job, params: {include_user_jobs_attributes: true}).to_custom_hash
	end

	def create
    job = current_user.jobs.build(job_params)
    if job.save
    	if job.pending?
    		res = {success: true}
    	else
    		res = {start_date: job.start_date, end_date: job.end_date}
    	end
      render json: res
    else
      error!({error: job.errors}, 422)
    end
	end

	def update
		job = Job.find(params[:id])
    if job.update!(job_params)
    	if job.pending?
    		render json: {success: true}
    	else
        render json: {refresh: true}
    	end
    else
      error!({error: job.errors}, 422)
    end
	end

	private

	def job_params
    params.require(:job).permit(:name, :status, :job_number, :location, :start_date, :end_date, :body,
      user_jobs_attributes: [:id, :user_id, :_destroy])
	end
end
