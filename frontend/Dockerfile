FROM httpd:2.4-alpine

COPY --from=builder /app/dist/ /usr/local/apache2/htdocs/

RUN sed -i \
    -e 's/^#\(LoadModule rewrite_module .*\)/\1/' \
    -e 's/^#\(LoadModule deflate_module .*\)/\1/' \
    -e 's/^#\(LoadModule headers_module .*\)/\1/' \
    conf/httpd.conf

COPY apache-frontend.conf /usr/local/apache2/conf/extra/frontend.conf

RUN echo "Include conf/extra/frontend.conf" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80

CMD ["httpd-foreground"]

