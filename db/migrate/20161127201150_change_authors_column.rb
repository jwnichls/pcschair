class ChangeAuthorsColumn < ActiveRecord::Migration
  def up
    change_column :venues, :paper_authors, :text
  end

  def down
    change_column :venues, :paper_authors, :string
  end
end
