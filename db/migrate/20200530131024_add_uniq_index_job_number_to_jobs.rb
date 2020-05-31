class AddUniqIndexJobNumberToJobs < ActiveRecord::Migration[6.0]
  def change
    remove_index :jobs, :job_number
    add_index :jobs, :job_number, unique: true
  end
end
