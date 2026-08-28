const { mongoose } = require ("mongoose")

const dbConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`Mongodb connected on ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = dbConnection