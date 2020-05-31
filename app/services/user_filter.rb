class UserFilter
  include ActiveModel::Model
  attr_accessor :email, :first_name, :last_name, :roles, :archived

  def result
    users = User.with_attached_avatar

    if email.present?
      users = users.where('email ilike ?', "#{email}%")
    end

    if first_name.present?
      users = users.where('first_name ilike ?', "#{first_name}%")
    end

    if last_name.present?
      users = users.where('last_name ilike ?', "#{last_name}%")
    end

    if roles.present?
      users = users.where(role: roles)
    end

    if archived.present?
      users = users.where(archived: archived)
    end

    users
  end
end