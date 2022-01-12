#!/bin/sh
systemctl is-active --quiet mongod
if [ $? -ne 0 ]
then
    echo systemctl start mongod
    systemctl start mongod
fi
node tools/clean-dist.cjs &&\
node tools/build-dist.cjs &&\
cd dist &&\
node \
--es-module-specifier-resolution=node index.js \
--enable-source-maps