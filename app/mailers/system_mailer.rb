class SystemMailer < ApplicationMailer

  def welcome_user(full_name, email, password)
    @email = email
    @full_name = full_name
    @password = password
    mail to: "#{@email}", subject: 'Welcome to Platform'
  end
end
