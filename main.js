let lat = 52.522835, long = -1.852475;
let src, dest;
function initGeolocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
            console.log(position);
            long = position.coords.longitude, lat = position.coords.latitude;
            mapboxgl.accessToken = 'pk.eyJ1IjoicG9vamFjaGhpa2FyYWRhaGl5YSIsImEiOiJjbGgzMGRtMXcxaXgzM3FyenpkYmptc2hiIn0.JtZhvADuuJdUuEJfWrO2sw';
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [long,lat],
                zoom: 16
            });
            map.addControl(
                new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true
                })
            );
            map.addControl(
                new MapboxDirections({
                    accessToken: mapboxgl.accessToken
                }),
                'bottom-left'
            );
            map.on('click',(e)=>{
                console.log(e);
                dest = e.lngLat;
            });
        });
    } else {
        alert('Sorry, your browser does not support geolocation services.');
    }
};
$(document).ready(function() {
    alert('Please allow access to your location.');
    initGeolocation();
});
$(function() {
    $('#navigate-button').click(function() {
        window.location.href = `arnavigation.html?src=${long};${lat}&dest=${dest.lng};${dest.lat}`;
    });
});