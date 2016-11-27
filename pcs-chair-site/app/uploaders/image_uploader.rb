# encoding: utf-8

class ImageUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
  include CarrierWave::RMagick

  # Choose what kind of storage to use for this uploader:
  storage :file
  # storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # Process files as they are uploaded into 3 versions
  #  - small will be used for icons and lists of images on various pages
  #  - the regular image will be limited to 500 pixels max in one dimension
  
  version :small do
    process :orient
    process :resize_to_limit => [64, 64]
  end
  
  process :orient
  process :resize_to_limit => [500, 500]

  def orient()
    manipulate! do |img|
      img = img.auto_orient
    end
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(jpg jpeg gif png)
  end

end
