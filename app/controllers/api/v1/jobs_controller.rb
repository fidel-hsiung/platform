class Api::V1::JobsController < Api::V1::BaseController

  def index
    name = params[:name]
    job_number = params[:job_number].present? ? params[:job_number] : ''
    start_date = params[:start_date].present? ? params[:start_date].to_date : ''
    end_date = params[:end_date].present? ? params[:end_date].to_date : ''
    statuses = params[:statuses].present? ? params[:statuses].select(&:present?) : []
    attendee_ids = params[:attendee_ids].present? ? params[:attendee_ids].select(&:present?) : []
    creator_ids = params[:creator_ids].present? ? params[:creator_ids].select(&:present?) : []
    sort_by = params[:sort_by].in?(%w(id name job_number start_date status users_count)) ? params[:sort_by] : 'id'
    sort_method = params[:sort_method].in?(%w(asc desc)) ? params[:sort_method] : 'asc'
    current_page = params[:page].present? ? params[:page].to_i : 1

    jobs = JobFilter.new({
      name: name,
      job_number: job_number,
      statuses: statuses,
      start_date: start_date,
      end_date: end_date,
      attendee_ids: params[:attendee_ids] || [],
      creator_ids: params[:creator_ids] || []
    }).result

    sorted_jobs = jobs.select('jobs.*, COUNT(user_jobs.id) as users_count').group('jobs.id').order(Arel.sql("#{params[:sort_by]} #{params[:sort_method]}")).page(current_page)
    total_pages = sorted_jobs.total_pages

    render json: {jobs: Api::V1::JobSerializer.new(sorted_jobs, params: {include_users: true}).to_custom_hash, total_pages: total_pages}
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
      render json: Api::V1::JobSerializer.new(job).to_custom_hash
    else
      error!({error: job.errors}, 422)
    end
	end

	def update
		job = Job.find(params[:id])
    if job.update!(job_params)
      render json: Api::V1::JobSerializer.new(job).to_custom_hash
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
