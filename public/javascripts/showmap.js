mapboxgl.accessToken=mapToken
const campgroundObject=campground
const map=new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campgroundObject.geometry.coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
});



console.log(campgroundObject.geometry.coordinates)

// Create a default Marker and add it to the map.
const marker=new mapboxgl.Marker()
    .setLngLat(campgroundObject.geometry.coordinates)
    .addTo(map)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campgroundObject.title}</h3><p>${campgroundObject.location}</p>
                <a href="/campgrounds/${campgroundObject._id}">View Campground</a>`


            )
    )
    .addTo(map).togglePopup()
