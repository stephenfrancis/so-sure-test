# Node Vagrant Server
Base node.js app repository

## Setup

Clone the repository

```
vagrant up
vagrant ssh
cd /vagrant
node app.js
```

The server should then be accessible from localhost:1337 on them host machine

If you want to use a database:
Mysql and Mongo are both installed on the vagrant machine
To access the from a db manager, use a SSH tunnel:
```
localhost:2222
user: vagrant
pwd:  vagrant
```
Then use the usual basic connections ( Feel free to create your own users etc...):

Mongo:
```
127.0.0.1:27017
user: root
pwd:  root
```

Mysql:
```
127.0.0.1:3306
user: root
pwd:  root
```
