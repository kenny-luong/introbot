const DiscordBot = require('./src/bot');
const yaml = require('js-yaml');
const fs   = require('fs');
const mongoose = require('mongoose');
const config = yaml.load(fs.readFileSync('config/config.yml', { encoding: 'utf-8' }));

mongoose.connect(config.services.mongo.url, { useNewUrlParser: true})
  .then(() => {
    console.log('MongoDB Connected')    
  })
  .catch(err => console.log(err));

let bot = new DiscordBot(config);