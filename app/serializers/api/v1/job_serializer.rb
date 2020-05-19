class Api::V1::JobSerializer < Api::V1::BaseSerializer

  attributes :name, :location, :body, :status, :start_date, :end_date
end
