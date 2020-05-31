class JobFilter
  include ActiveModel::Model
  attr_accessor :name, :job_number, :statuses, :start_date, :end_date, :attendee_ids, :creator_ids

  def result
    jobs = Job.includes(users: {avatar_attachment: :blob}).left_joins(:user_jobs).distinct

    if name.present?
      jobs = jobs.where('name ilike ?', "#{name}%")
    end

    if job_number.present?
      jobs = jobs.where(job_number: job_number)
    end

    if statuses.present?
      jobs = jobs.where(status: statuses)
    end

    if start_date.present? && end_date.present?
      jobs = jobs.where('start_date <= ? AND end_date >= ?', end_date, start_date)
    elsif start_date.present?
      jobs = jobs.where('start_date >= ?', start_date)
    elsif end_date.present?
      jobs = jobs.where('start_date <= ?', end_date)
    end

    if attendee_ids.present?
      jobs = jobs.where('user_jobs.user_id in (?)', attendee_ids)
    end

    if creator_ids.present?
      jobs = jobs.where('jobs.user_id in (?)', creator_ids)
    end

    jobs
  end
end