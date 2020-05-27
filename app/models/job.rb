class Job < ApplicationRecord
	belongs_to :user

	has_many :user_jobs, dependent: :destroy
	has_many :users, through: :user_jobs

  accepts_nested_attributes_for :user_jobs, allow_destroy: true

	enum status: {pending: 0, active: 1, finished: 2, failed: 3}

	validates :name, :location, :body, :status, presence: true
	validates :start_date, :end_date, :job_number, presence: true, unless: :pending?
  validates_uniqueness_of :job_number, unless: :pending?
  validate :start_date_valid?, on: :create
  validate :end_date_valid?

  scope :active, -> { where("start_date <= ? AND end_date >= ? AND status = ?", Date.current, Date.current, 1) }
  scope :upcoming, -> { where("start_date > ?", Date.current) }
  scope :delayed, -> { where("end_date < ? AND status = ?", Date.current, 1) }
  scope :calendar, -> (date) { where("start_date <= ? AND end_date >= ? AND status != ?", date.end_of_month.end_of_week, date.beginning_of_month.beginning_of_week, 0) }
  scope :month, -> (date) { where("start_date <= ? AND end_date >= ?", date.end_of_month, date.beginning_of_month) }

  private

  def start_date_valid?
     errors.add(:start_date, "can't before today") if start_date.present? && start_date < Date.current
  end

  def end_date_valid?
    errors.add(:end_date, "can't before start date") if start_date.present? && end_date.present? && end_date < start_date
  end
end
