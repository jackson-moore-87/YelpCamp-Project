const mongoose = require('mongoose');
const axios = require('axios');
const Campground = require('../models/campground.js');
const cities = require('./cities.js');
const {places, descriptors} = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(function(){
    console.log("Connection Open");
})
.catch(function(err){
    console.log("oh no error");
    console.log(err);
})

const sample = function(array){
   return array[Math.floor(Math.random() * array.length)];
}

  // call unsplash and return small image
  async function seedImg() {
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'fo9w59klmq-4uE7zes5ikMSPGYrUXraVE8CuZdb65YA',
          collections: 1114848,
        },
      })
      return resp.data.urls.small
    } catch (err) {
      console.error(err)
    }
  }

const seedDB = async function(){
    await Campground.deleteMany({});
    for(let i = 0; i < 5; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() *20 + 10)
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: await seedImg(),
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit odio iusto possimus natus eveniet. Eum modi dolores reiciendis perferendis sapiente a eius, iusto quaerat? Dicta excepturi asperiores odit voluptas maxime.',
            price: price
        });
        await camp.save();
    }
}

seedDB()
.then(function(){
    mongoose.connection.close();
})