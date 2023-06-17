const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filmSchema = new Schema ({
    Name: {
        type: String,
        required: true,
    },
    ReleaseYear: {
        type: String,
        required: true,
    },
    Genre: {
        type: String,
        required: true,
    },
    Country: {
        type: String,
        required: true,
    },
    Age: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Image: {
        type: String,
        required: false,
    },
});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;
