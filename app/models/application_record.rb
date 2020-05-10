class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  include Storageable
end
