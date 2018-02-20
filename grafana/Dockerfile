FROM grafana/grafana:latest

RUN apt-get update && \
    apt-get install -y curl gettext-base && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/grafana/dashboards
RUN mkdir -p /etc/grafana/datasources
RUN mkdir -p /etc/grafana/provisioning
COPY dashboards /etc/grafana/dashboards
COPY datasources /etc/grafana/datasources
COPY defaults.ini /etc/grafana/defaults.ini
COPY provisioning /etc/grafana/provisioning
WORKDIR /app