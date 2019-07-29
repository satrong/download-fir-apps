const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/firDownload', {
    useNewUrlParser: true,
    useCreateIndex: true,
});

const ShortIds = mongoose.model('shortIds', {
    short: {
        type: String,
        index: true,
    },
    type: String,
    status: Number,
});

module.exports = { ShortIds };
