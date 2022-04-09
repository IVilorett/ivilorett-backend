// Import mongoose
mongoose = require('mongoose')

// Import Database scheme
const Cat = require('./models/cat')

// Import credentials
const credentials = require('./credentials')
const { runMain } = require('module')

// Connection URI
const DATABASE_NAME = 'dbtest'
const dbURI = 'mongodb+srv://'+credentials.MONGO_USER+':'+credentials.MONGO_PASSWORD+'@cluster0.zv0jo.mongodb.net/'+DATABASE_NAME+'?retryWrites=true&w=majority'

async function run(){
    try{
        await mongoose.connect(dbURI)
        console.log("Connected to MongoDB")

        // Read (all)
        let allCats = await Cat.find()

        console.log("----------------------------------------------")
        console.log("All cats: ")
        if(allCats.length && allCats.length > 0)
        {
            allCats.forEach(c => {
                console.log(JSON.stringify(c))
            });
        } else {
            console.log("No cats. ")
        }
        

        // Create
        const cat1 = new Cat({
            name: 'Lil Cat',
            age: 0.5,
            color: 'dark'
        })
        let createdCat = await cat1.save()

        console.log("----------------------------------------------")
        console.log('Created cat: ', JSON.stringify(createdCat))
        
        // Read (with query)
        let foundCat = await Cat.findOne({
            name:'Lil Cat'
        })
        
        console.log("----------------------------------------------")
        console.log('Found cat: ', JSON.stringify(foundCat))
        
        // Delete
        let deletedCats = await Cat.deleteMany({
            name: 'Lil Cat'
        })

        console.log("----------------------------------------------")
        console.log("Deleted cats: \n", JSON.stringify(deletedCats))


        process.exit(0)

    } catch(e) {
        console.log(e)
        process.exit(1)
    }
}

run()


