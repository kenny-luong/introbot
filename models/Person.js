const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
    name: { type: String, required: true },
    discord_id: { type: String, required: true },
    audio: { type: String, required: true }
}, {
    collection: 'people',
    safe: true
})

module.exports = Person = mongoose.model('person', PersonSchema)