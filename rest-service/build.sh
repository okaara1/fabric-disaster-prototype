docker build -t filippoboiani/rest-service .
docker run -p 3000:3000 -d filippoboiani/rest-service:latest
open "http://localhost:3000/welcome"