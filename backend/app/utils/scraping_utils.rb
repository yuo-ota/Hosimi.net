require 'open-uri'
require 'nokogiri'

module ScrapingUtils
    def self.fetch_data_by_url(url)
        URI.open(url).read
    end

    def self.fetch_html(html)
        Nokogiri::HTML(html)
    end

    def self.fetch_xml(xml)
        Nokogiri::XML(xml)
    end
end