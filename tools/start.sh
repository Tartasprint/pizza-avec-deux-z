#!/bin/sh
systemctl is-active --quiet mongod
if [ $? -ne 0 ]
then
    echo systemctl start mongod
    systemctl start mongod
fi
node tools/build-dist.js \
&& node index.js