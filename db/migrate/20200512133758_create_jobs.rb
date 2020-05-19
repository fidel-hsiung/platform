class CreateJobs < ActiveRecord::Migration[6.0]
  def change
    create_table :jobs do |t|
      t.references :user, foreign_key: true, index: true
      t.string :job_number, index: true
      t.string :name
      t.string :location
      t.date :start_date
      t.date :end_date
      t.text :body
      t.integer :status, default: 0, index: true

      t.timestamps
    end

    add_index :jobs, [:start_date, :end_date]
  end
end
