FROM httpd:2.4-alpine

# Enable required Apache modules
RUN sed -i \
    -e 's/^#\(LoadModule proxy_module .*\)/\1/' \
    -e 's/^#\(LoadModule proxy_http_module .*\)/\1/' \
    -e 's/^#\(LoadModule rewrite_module .*\)/\1/' \
    -e 's/^#\(LoadModule headers_module .*\)/\1/' \
    conf/httpd.conf

# Copy Apache configuration
COPY apache-config.conf /usr/local/apache2/conf/extra/proxy.conf

# Include the proxy configuration in the main config
RUN echo "Include conf/extra/proxy.conf" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80

CMD ["httpd-foreground"]