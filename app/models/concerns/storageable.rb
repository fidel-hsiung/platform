module Storageable
  extend ActiveSupport::Concern

  module ClassMethods

    def has_one_customized_attached(attach_sttr, **options)

      attach_attr_string = attach_sttr.to_s
      attach_type = options[:type] || 'image'
      attach_required = options[:required]
      attach_require_condition = options[:require_condition]
      attach_size_limit = options[:size_limit]&.to_i
      attach_default_path = options[:default] || ""

      class_eval %Q(
        has_one_attached :#{attach_attr_string}

        validate :check_#{attach_attr_string}

        def #{attach_attr_string}_url(size="")
          if #{attach_attr_string}.attached?
            Rails.application.routes.url_helpers.rails_blob_url(#{attach_attr_string}, only_path: true)
          else
            "#{attach_default_path}".present? ? ApplicationController.helpers.asset_pack_url("#{attach_default_path}") : ""
          end
        end

        def check_#{attach_attr_string}
          if #{attach_attr_string}.attached?
            if !(#{attach_attr_string}.content_type =~ %r(#{attach_type}))
              errors.add(:#{attach_attr_string}, "not a valid #{attach_type} format")
              #{attach_attr_string}.attachment.try(:destroy)
              self.#{attach_attr_string} = nil
            elsif #{attach_size_limit.present?} && #{attach_attr_string}.byte_size > #{attach_size_limit}
              errors.add(:#{attach_attr_string}, "not a valid size")
              #{attach_attr_string}.attachment.try(:destroy)
              self.#{attach_attr_string} = nil
            end
          else
            if #{attach_required.present? && attach_required == true}
              errors.add(:#{attach_attr_string}, "cannot be blank")
            elsif #{attach_require_condition.present? ? attach_require_condition : false}
              errors.add(:#{attach_attr_string}, "cannot be blank")
            end
          end
        end
      ) unless instance_methods.include? attach_attr_string.to_sym
    end
  end
end
