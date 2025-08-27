require 'open-uri'
require 'nokogiri'

module ScrapingUtils
    def self.fetch_html(url)
        URI.open(url).read
    end

    def self.fetch_data(html)
        Nokogiri::HTML(html)
    end
end