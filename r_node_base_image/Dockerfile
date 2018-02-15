FROM ubuntu:16.04

# Preparing to install R
RUN \
  apt-get update && \
  apt-get install sudo -y && \
  sudo -s && \
  echo "deb http://cran.rstudio.com/bin/linux/ubuntu xenial/" | tee -a /etc/apt/sources.list && \
  gpg --keyserver keyserver.ubuntu.com --recv-key E084DAB9 && \
  gpg -a --export E084DAB9 | apt-key add - && \
  apt-get update

#---------- Install Node.js & npm----------#

RUN \
  sudo apt-get install -y curl && \
  curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash - && \
  sudo apt-get install -y build-essential && \
  sudo apt-get update && \
  sudo apt-get install -y nodejs --no-install-recommends

# Install additional packages inside container required by R
RUN \
  apt-get install -y r-base r-base-dev libcurl4-openssl-dev libssl-dev libgsl-dev libsasl2-dev r-cran-rgl && \
  Rscript -e 'install.packages("xts", repos = "http://cran.us.r-project.org")' && \
  Rscript -e 'install.packages("imputeTS", repos = "http://cran.us.r-project.org")' && \
  Rscript -e 'install.packages("tseries", repos = "http://cran.us.r-project.org")' && \
  Rscript -e 'install.packages("forecast", repos = "http://cran.us.r-project.org")' && \
  Rscript -e 'install.packages("arfima", repos = "http://cran.us.r-project.org")' && \
  Rscript -e 'install.packages("rugarch", repos = "http://cran.us.r-project.org")' && \
  Rscript -e 'install.packages("tsoutliers", repos = "http://cran.us.r-project.org")' && \
  Rscript -e 'install.packages("reshape2", repos = "http://cran.us.r-project.org")' && \
  Rscript -e 'install.packages("Rssa", repos = "http://cran.us.r-project.org")' && \
  Rscript -e 'install.packages("e1071", repos = "http://cran.us.r-project.org")' && \
  Rscript -e 'install.packages("influxdbr", repos = "http://cran.us.r-project.org")' && \
  RUN Rscript -e 'install.packages("mongolite", repos = "http://cran.us.r-project.org")'
