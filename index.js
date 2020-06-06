const express = require('express')
const app = express()
const mongoose = require('mongoose')
const appconfigs = require('./appConfig/config')
const http = require('http')
const cookieparser = require('cookie-parser')
const bodyparser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')



app.use(cookieparser())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())


// app.use(middlewareOnStart.appOnstart)
// adding listerner

const server = http.createServer(app)
server.listen(appconfigs.port)

server.on('error', onError)
server.on('listening', onlisten)

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next();
});

function onError(err) {
    if (err) {
        console.log(err)
        console.log('server closed')
    }
    switch (error.code) {
        case 'EACCES':
            logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
            process.exit(1);
            break;
        default:
            logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
            throw error;
    }
}

function onlisten() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    ('Listening on ' + bind);
    console.log(`server is running on port ${appconfigs.port}`)

    let db = mongoose.connect(appconfigs.db.uri, { useNewUrlParser: true, useUnifiedTopology: true })
}
const firstData = [];
// graphql is the only end point in the entire route 
app.use('/graphql', graphqlHttp({
    // in schema we have to enter the folder where our schemas are present
    // built schema function take a string and it should define our schema
    /* 
1) inside schema => schema is fixed key word were we define query and mutation
2) query is GET request here
3) mutation is POST, PUT and DElETE
4) We can define any name in place of RootQuery and RootMutation type is because graphql is typed language 
5) in RootQuey we can name anything fr events and [String] defines it will return list of strings and [Strings!] that list is not null
   but empty list is accepted and [String!]!  it defines that events will not return null
6) In RootMutation createEvent can be named anything and it returns name with type as String
7) in type Events {} we are just defining the schema of the response that we want
8) in type RootQuery{
      events:[Events!]!
    }
     events:[Events!]! it's a query and we are fetching the data in the format defined in the type Events
9) input EventInput :- here input is the type defined in the graphql which can be used as args in mutation
10) createEvent(eventInput: EventInput): Events in here Events is we are creating Events with the schema structure
    */
    schema: buildSchema(`
    type Events{
    _id:ID!
    title:String!
    description:String!
    price:Float!
    date:String!
    }

    input EventInput{
        title:String!
        description:String!
        price:Float!
        date:String!
    }

    type RootQuery{
      events:[Events!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Events
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    } 
    `),
    /*  rootValue is the js object were we enter the js list resolver functions in it
     resolver functions need to match with schema end points by name  
     1) in resolver we define the query and mutation in the same name we definein RootQuery and Mutation
     2) while adding in rootValue we have to write a arrow functions for them (query and mutation)
     3) if we don't return a it will result as null because in schema we have defined this as :Events at the last
     */

    rootValue: {
        events: () => {
            return firstData;
        },
        createEvent: (args) => {
            const a = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.date
            }
            firstData.push(a)
            return a;
        }
    },
    graphiql: true
}))



mongoose.connection.on('open', (req, res, err) => {
    if (err) {
        console.log('Error while connecting to db')
    } else {
        console.log('successful while connecting to db')
    }
})

module.exports = server