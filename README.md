# Game-Website
 
 ## Setup
 
 1. Clone the repository
 2. Navigate to the repository directory
 3. Install [Docker](https://docs.docker.com/get-docker/).
 4. Run the following command:
 
 ```bash
 docker-compose up --build
 ```
 
 or if that doesn't work, try:
 
 ```bash
 docker compose up --build
 ```
 
 5. Access the webapp at `http://localhost:3001`
 6. Access Swagger documentation at `http://localhost:3000/api-docs/`
 This app uses Docker, which is a tool that allows us to package our application and its dependencies into a container that can run exactly the same on any machine.
 
## fake email: g@g   fake pw: admin
 
### Useful Commands
 ```bash
    docker compose down -v                                                                 (removes build)
    docker exec -it mysql_db mysql -u root -ppass123 -e "SELECT * FROM `user`;" gamedb     (Displays User table)
    docker logs frontend_client
    docker logs backend_api
 ```
 ### Database Credentials
 
     Host: localhost
     Port: 3307
     Username: root
     Password: pass123
 
 To log into the database, try this:
     
 
 ```bash
 docker exec -it game-website-db-1 /bin/bash
 mysql -u root -p
 ```
 
 ### Credits
 
 Neil Flores

 
 Liam Worsley
 
 John McMahon


 Original setup/design inspired/pulled from Neil's previous website project with

 Samuel Vader

 Madelyn Holveck
