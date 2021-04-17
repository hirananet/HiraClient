FROM nginx
COPY dist/hiraClientV2 /usr/share/nginx/html
COPY nginx.default.conf /etc/nginx/conf.d/default.conf
