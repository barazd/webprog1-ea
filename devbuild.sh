#!/bin/bash

IMAGE_NAME=webprog1ea
PORT=8111

echo "Konténer éptése..."

if docker build -t $IMAGE_NAME .; then
    echo "A(z) $IMAGE_NAME sikeresen megépítve! A konténer futtatása..."
    docker kill $(docker ps -q)
    docker run -d -p $PORT:80 $IMAGE_NAME:latest
    echo "A konténer elérhető http://localhost:$PORT címen."
else
    echo "Sikertelen építés!"
fi
