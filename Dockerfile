FROM nginx:1.15.12-alpine

LABEL description="AgenaRisk web app image"

LABEL MAINTAINER="Dementiev Eugene"

RUN rm -rf /usr/share/nginx/html

COPY build /usr/share/nginx/html

COPY assets/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod a+x /docker-entrypoint.sh
