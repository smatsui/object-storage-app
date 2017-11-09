# Object Storage Application

> This is the REST API proxy server for [Object Storage Network](https://github.com/smatsui/object-storage-network).

After deploying the Object Storage Network, run the following command to start this server.

```
$ cd object-storage-app
$ npm install
$ npm start
```

Once the server gets started, you can run REST APIs to put and get your data to the blockchain based object storage.
You need to run the following command to create an account.

```
$ curl -X PUT http://localhost:3000/testuser
Account testuser is created
```

Run the following command to create your containers.

```
$ curl -X PUT http://localhost:3000/testuser/container0
Container container0 is created
$ curl -X PUT http://localhost:3000/testuser/container1
Container container1 is created
```

You can get a list of the containers by the following command.

```
$ curl -X GET http://localhost:3000/testuser
Resource {id=org.acme.objectstore.Container#testuser/container0},Resource {id=org.acme.objectstore.Container#testuser/container1}
```

You can put your data to your container.

```
$ curl -X PUT http://localhost:3000/testuser/container0/obj0  -H "Content-Type: text/html; charset=UTF-8" -d "hello"
Object obj0 is created
$ curl -X PUT http://localhost:3000/testuser/container0/obj1  -H "Content-Type: text/html; charset=UTF-8" -d "hello hello"
Object obj1 is created
```

A list of the objects in your container can be displayed by the following command.

```
$ curl -X GET http://localhost:3000/testuser/container0
Resource {id=org.acme.objectstore.Object#testuser/container0/obj0},Resource {id=org.acme.objectstore.Object#testuser/container0/obj1}
```

Data of the objects can be obtained by the following commands.

```
$ curl -X GET http://localhost:3000/testuser/container0/obj0
hello
$ curl -X GET http://localhost:3000/testuser/container0/obj1
hello hello
```

Congratulations!
