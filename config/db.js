const mongoose = require('mongoose');
const config = require('config');
const urlDb = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(urlDb, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Db connected...')
    } catch(err) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;