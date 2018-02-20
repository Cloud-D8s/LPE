FROM grafana/grafana:latest

RUN apt-get update && \
    apt-get install -y curl gettext-base && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/grafana/dashboards
RUN mkdir -p /etc/grafana/datasources
COPY dashboards /etc/grafana/dashboards
COPY datasources /etc/grafana/datasources
COPY grafana.ini /etc/grafana/grafana.ini
WORKDIR /app
COPY entrypoint.sh ./
RUN chmod u+x entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
