#!/bin/bash

hexo clean

hexo generate

cp README.md public

hexo deploy