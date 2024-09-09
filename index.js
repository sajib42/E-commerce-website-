const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

//middlewear 
app.use(express());
app.use(cors());
app.use(express.json());


//mongo//////////////////////////
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri3 = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s06odgh.mongodb.net/?retryWrites=true&w=majority`;
// const uri2 = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@z-gear.dlt9jqj.mongodb.net/?retryWrites=true&w=majority&appName=z-gear`
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s06odgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        //add to data mongo db
        const database = client.db("usersDB")
        const productCollection = database.collection('products')
        const cart = database.collection('cart')
        //add cart
        app.post("/addtocart", async function (req, res) {
            const data = req.body;
            const { productID, email } = data;
            const result = cart.find({ productID: productID, email: email })
            const finalResult = await result.toArray();
            if (finalResult.length == 0) {
                await cart.insertOne(data)
                res.send({ msg: "done" })
            }
            else {
                res.send({ msg: "already added" })
            }
        })

        //get cart
        app.get("/getcartdata/:email", async (req, res) => {
            const userEmail = req.params.email
            const result = cart.find({ email: userEmail })
            const data = await result.toArray();
            res.send(data)
        })

        //delet cart
        app.delete("/getcartdata/:id", async (req, res) => {
            const id = req.params.id
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const results = await cart.deleteOne(query)
            res.send(results)
        })

        // add product
        app.post('/addproduct', async (req, res) => {
            const body = req.body;
            let response = true
            try {
                await productCollection.insertOne(body)
            } catch (e) {
                response = false
                console.log(e);
            }

            res.send({ msg: response })
        })
        app.get('/getproduct', async (req, res) => {
            const data = productCollection.find({});
            const result = await data.toArray()
            res.send({ result: result })
        })
        //iPHONE
        app.get('/getproduct2/:phone', async (req, res) => {
            const phone = req.params.phone
            console.log(phone);
            const data = productCollection.find({ category: phone });
            console.log(data);
            const result = await data.toArray()
            res.send({ result: result })
        })
        //MACBOOK  ? Laptop
        app.get('/getproduct2/macbook', async (req, res) => {
            const macbook = req.params.macbook
            console.log(macbook);
            const data = productCollection.find({ category: macbook });
            console.log(data);
            const result = await data.toArray()
            res.send({ result: result })
        })
        //watch
        app.get('/getproduct2/:watch', async (req, res) => {
            const watch = req.params.watch
            const data = productCollection.find({ category: watch });
            console.log(data);
            const result = await data.toArray()
            res.send({ result: result })
        })
        //imac ? Camera
        app.get('/getproduct2/:imac', async (req, res) => {
            const imac = req.params.imac
            console.log(imac);
            const data = productCollection.find({ category: imac });
            console.log(data);
            const result = await data.toArray()
            res.send({ result: result })
        })
        //airpod
        app.get('/getproduct2/:airpod', async (req, res) => {
            const airpod = req.params.airpod
            const data = productCollection.find({ category: 'Earphone' });
            console.log(data);
            const result = await data.toArray()
            res.send({ result: result })
        })
        //product_info
        app.get('/getproduct/:id', async (req, res) => {
            const id = req.params.id
            const data = productCollection.find({ _id: new ObjectId(id) });
            console.log(data);
            const result = await data.toArray()
            res.send({ result: result })
        })

        //product_update
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id
            const data = req.body
            console.log(typeof (data.price));
            console.log(id, data);
            const newData = await productCollection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...data } })
            res.send({ msg: "update" })
        })





        //post method by id
        // app.post("/users", async (req, res) => {
        //     const user = req.body;
        //     console.log('new user at ', user);
        //     const result = await userCollaction.insertOne(user);
        //     res.send(result)

        // })
        // //put method 
        // app.get("/users/:id", async (req, res) => {
        //     const id = req.params.id
        //     const updatedUser = req.body;
        //     console.log(updatedUser, id);
        //     const query = { _id: new ObjectId(id) }
        //     const user = await userCollaction.findOne(query)
        //     res.send(user)
        // })


        // app.delete('/users/:id', async (req, res) => {
        //     const id = req.params.id
        //     console.log('delete id', id);
        //     const query = { _id: new ObjectId(id) }
        //     const results = await userCollaction.deleteOne(query)
        //     res.send(results)
        // })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


///////////////////////////////////////
app.get("/", (req, res) => {
    res.send("port in on")
})

app.listen(port, () => console.log("CURD Operation"))