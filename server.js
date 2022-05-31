const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const connectionString = process.env.mongoPath
const MongoClient = require('mongodb').MongoClient

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('role')
        const roleCollection = db.collection('role')
        app.set('view engine', 'ejs')
        app.use(express.static('public'))
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: true }))
        port = process.env.PORT || 80
        app.listen(port,
            () =>
            console.log(`Started server at ${port}`));
        // app.listen(3000, function() {
        //     console.log('listening on 3000')
        // })
        app.get('/', (req, res) => {
            db.collection('role').find().toArray()
                .then(results => {
                    res.render('index.ejs', { role: results })
                })
                .catch(error => console.error(error))
        })
        app.post('/role', (req, res) => {
            roleCollection.insertOne(req.body)
                .then(result => {
                    console.log(result)
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        // app.post('/deleterole', (req, res) => {
        //     roleCollection.deleteOne({ role: req.body.role })
        //         .then(result => {
        //             if (result.deletedCount === 0) {
        //                 // return res.json('No role to delete')
        //             }
        //             // res.json(`Deleted successfully`)
        //         })
        //         .catch(error => console.error(error))
        //     res.redirect('/')
        // })

        // HTML FORMS cannot use delete or put methods
        // simple workaounrd is to use fetch API... 
        app.delete('/role', (req, res) => {
            roleCollection.deleteOne({ role: req.body.role })
                .then(result => {
                    if (result.deletedCount === 0) {
                        // return res.json('No role to delete')
                    }
                    // res.json(`Deleted successfully`)
                })
                .catch(error => console.error(error))
            res.redirect('/')
        })

        // app.post('/updatename', async(req, res) => {
        //     await roleCollection.findOneAndUpdate({ name: req.body.name1 }, {
        //             $set: {
        //                 name: req.body.name2
        //             }
        //         }, {
        //             upsert: true
        //         })
        //         .then(result => res.redirect('/'))
        //         .catch(error => console.error(error))
        // })

        app.put('/role', async(req, res) => {
            await roleCollection.findOneAndUpdate({ name: req.body.name1 }, {
                    $set: {
                        name: req.body.name2
                    }
                }, {
                    upsert: false
                })
                .then(result => console.log(result.ok))
                .catch(error => console.error(error))
            res.redirect('/')
        })
    })
    .catch(error => console.error(error))

console.log(__dirname)