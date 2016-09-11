#!/bin/bash

hexo clean

hexo generate

cp README.md public
cp 404.html public

hexo deploy