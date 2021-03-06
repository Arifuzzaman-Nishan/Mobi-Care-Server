const express = require('express')
const port = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID

const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d30gd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const serviceCollection = client.db("mobi-care").collection("service");

    const orderCollection = client.db("mobi-care").collection("orders");

    const reviewCollection = client.db("mobi-care").collection("review");

    const adminCollection = client.db("mobi-care").collection("addAdmin");

    console.log("connected");

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    app.post('/addService', (req, res) => {
        const serviceData = req.body;

        console.log(serviceData);
        serviceCollection.insertOne(serviceData)
            .then(result => {
                res.send(result.insertedCount > 0);
                //   console.log(result);
            })
    })

    app.get('/allService', (req, res) => {
        serviceCollection.find()
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    //   
    app.get('/specificService/:id', (req, res) => {
        serviceCollection.find({ _id: ObjectID(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/orders', (req, res) => {
        console.log(req.body);
        orderCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/allOrders', (req, res) => {
        // console.log(req.query.email);
        orderCollection.find()
            .toArray((err, documents) => {
                res.send(documents)
            })
    })


    // for order show api
    app.get('/showOrder', (req, res) => {
        console.log(req.query.email);
        orderCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // send data to review
    app.post('/review', (req, res) => {
        reviewCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    // get data from review
    app.get('/showReview', (req, res) => {
        
        reviewCollection.find()
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // update
    app.patch('/update/:id', (req, res) => {
        console.log(req.body);
        orderCollection.updateOne({ _id: ObjectID(req.params.id) }, {
            $set: {
                status: req.body.status
            }
        })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })

    //addAdmin
    app.post('/addAdmin', (req, res) => {
        console.log(req.body);
        adminCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    //isAdmin
    app.post('/isAdmin', (req, res) => {
        console.log(req.body);
        adminCollection.find({ email: req.body.email })
            .toArray((err, documents) => {
                res.send(documents.length > 0)
            })
    })

    // delete order
    app.delete('/orderDelete/:id', (req, res) => {
        orderCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

    // delete service
    app.delete('/serviceDelete/:id', (req, res) => {
        serviceCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })




});


app.listen(process.env.PORT || port);