class Api::V1::BaseSerializer
  include FastJsonapi::ObjectSerializer

  set_id :id
  
  def to_custom_hash
  	data = serializable_hash

  	if data[:data].is_a? Hash
  		data[:data][:attributes]
  	elsif data[:data].is_a? Array
  		data[:data].map{ |m| m[:attributes] }
  	elsif data[:data].nil?
  		nil
  	else
  		data
  	end
  end

  class << self
    def has_one resource, options={}
      serializer = options[:serializer] || "#{resource.to_s.classify}Serializer".constantize

      attribute resource do |object|
        serializer.new(object.try(resource)).to_custom_hash
      end
    end

    def has_many resources, options={}
      serializer = options[:serializer] || "#{resources.to_s.classify}Serializer".constantize

      attribute resources do |object|
        serializer.new(object.try(resources)).to_custom_hash
      end
  	end
  end
end
