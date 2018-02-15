FROM cloudpie/r_node_base_image:latest

# Install new packages here
#RUN Rscript -e 'install.packages("mongolite", repos = "http://cran.us.r-project.org")'

# Making necessary folders
RUN \
  mkdir /home/ForecastingService && \
  cd /home/ForecastingService

WORKDIR "/home/ForecastingService"

# Install app dependencies
COPY package.json /home/ForecastingService/
RUN npm install

# Copying the data from the local folder to the container
COPY . /home/ForecastingService/

EXPOSE 8080

CMD [ "npm", "start"]

# Testing with commands in CLI:
# [no InfluxDB - results in a .RData file in the same folder] Rscript ForecastingService.R --target=test.csv --starttime=1518524056 --type=BATCH
# [with InfluxDB - results in a database in Influx] Rscript ForecastingService.R --target=test.csv --type=SINGLE --client=client1 --predsteps=10 --dbhost=localhost:8086 --dbuser=root --dbpassword=root
