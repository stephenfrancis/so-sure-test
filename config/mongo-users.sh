# add users
mongo admin <<EOF
    use so-sure-node;
    db.createUser(
      {
        user: "root",
        pwd: "root",
        roles: [ { role: "root", db: "admin" } ]
      }
    );
EOF
