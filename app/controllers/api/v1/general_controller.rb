class Api::V1::GeneralController < Api::V1::BaseController

  def url_error
    return error!({error: ['Invalid url!']}, 500)
  end
end
