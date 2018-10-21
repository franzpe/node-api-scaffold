# Node api with basic authentication features written in ES6

Install npm dependencies for project: npm install

Create .env in root file with variables listed down below or change them in config
```javascript
PORT=3000
DB_HOST= database_host
DB_USER= database_login_user
DB_PASSWORD= database_login_password
DB_DATABASE= database
JWT= jwt_secret
```

Database used in this project is MySQL with bookshelf ORM, you can use any type of db but you're gonna need to rewrite model and controller logic. Migrating to MongDB which is commonly used with node.js is very simple.

Make sure you have User table created in your database, you can use creation script down below.

```
Create table User (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userName varchar(50) NOT NULL unique,
  password varchar(50) NOT NULL unique
)
```

You can run server via npm script: npm start

Server is also serving static files inside web folder. You may want to delete or change this functionality in appMiddleware.js (~/server/middleware/appMidleware). To access web in browser just type http://localhost:{PORT}/. 


