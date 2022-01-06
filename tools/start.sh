#!/bin/sh
systemctl is-active --quiet mongod
if [ $? -ne 0 ]
then
    echo sudo systemctl start mongod
    sudo systemctl start mongod
fi
node tools/build-dist.js \
&& node index.js