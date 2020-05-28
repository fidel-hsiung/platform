class User < ApplicationRecord
  has_secure_password
  has_one_customized_attached :avatar, default: 'media/images/default-user.png'

  has_many :jobs
  has_many :user_jobs
  has_many :assigned_jobs, through: :user_jobs, source: :job

  validates_presence_of :email, :first_name, :last_name
  validates_uniqueness_of :email

  before_save :downcase_email
  before_save :format_names

  enum role: {employee: 0, contract: 1, admin: 2}

  scope :unarchived, -> { where(archived: false) }

  def full_name
  	"#{first_name} #{last_name}"
  end

  private

  def downcase_email
  	self.email = email.downcase.strip if email_changed?
  end

  def format_names
  	self.first_name = first_name.strip.upcase_first if first_name_changed?
  	self.last_name = last_name.strip.upcase_first if last_name_changed?
  end
end
