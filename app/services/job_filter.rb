class JobFilter
  include ActiveModel::Model
  attr_accessor :date, :statuses, :attendee_ids, :creator_ids

  def result
    all_jobs = Job.normal
  end
end