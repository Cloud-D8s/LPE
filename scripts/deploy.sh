#!bin/sh
echo "setup"
sudo iptables -P INPUT ACCEPT
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update
#docker Installation
sudo apt-get install -y docker-ce
#sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
#docker-compose Installation
curl -L https://github.com/docker/compose/releases/download/1.13.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
cd ..
#build and run container
sudo mkdir -p /srv/docker/influxdb/data
sudo mkdir -p ./data/db
sudo docker-compose up --build&
read -p "Press enter to Exit"

