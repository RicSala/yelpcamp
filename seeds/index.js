import mongoose from 'mongoose';
import Campground from "../models/campground.js";
import cities from './cities.js';
import { places, descriptors } from './seedHelpers.js';



mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp') // TODO: Why is he using options here?
    .then(() => console.log("Connected to MongoDB"))
    .catch(e => console.log("ERROR connecting MongoDB: ", e))



const sample=array => array[Math.floor(Math.random()*array.length)]

const seedDB=async () => {
    await Campground.deleteMany();
    for (let i=0; i<200; i++) {
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10
        const newCampground=new Campground({
            location: `${cities[random1000].city} - ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dwr2im3wk/image/upload/v1679659328/Yelpcamp/pewbvx90mtbly5p9sayi.jpg',
                    filename: 'Yelpcamp/pewbvx90mtbly5p9sayi',
                },
                {
                    url: 'https://res.cloudinary.com/dwr2im3wk/image/upload/v1679659328/Yelpcamp/oaaxgsn23niulgngdmcl.jpg',
                    filename: 'Yelpcamp/oaaxgsn23niulgngdmcl',
                },
                {
                    url: 'https://res.cloudinary.com/dwr2im3wk/image/upload/v1679659329/Yelpcamp/pqyuziarwzafhw0v0tqq.jpg',
                    filename: 'Yelpcamp/pqyuziarwzafhw0v0tqq',
                }
            ]
            ,
            author: "641b5b6d04cce4c6002b28e9",
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.Voluptas, perferendis repellat excepturi nihil reprehenderit exercitationem labore voluptatibus, expedita quibusdam modi neque aperiam velit sunt aspernatur optio sapiente, consequatur nulla architecto!',
            price,
        })
        await newCampground.save()

    }
}

seedDB().then(() => {
    mongoose.connection.close()
})

