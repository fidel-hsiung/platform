require 'rails_helper'

RSpec.describe Job, type: :model do

  describe '#start_date_valid?' do
    it 'should be invalid if before today' do
      job = Job.new(FactoryBot.attributes_for(:job, start_date: Date.current-2.days))
      expect(job.valid?).to eq false
      expect(job.errors['start_date']).to eq ['can\'t before today']
    end
  end

  describe '#end_date_valid?' do
    it 'should be invalid if before start_date' do
      job = Job.new(FactoryBot.attributes_for(:job, start_date: Date.current+2.days, end_date: Date.current+1.day))
      expect(job.valid?).to eq false
      expect(job.errors['end_date']).to eq ['can\'t before start date']
    end
  end
end
