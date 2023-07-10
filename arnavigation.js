let coords = {};
$(document).ready(function() {
    getCoords();
    renderElements();
});
function getCoords() {
    let searchParams = new URLSearchParams(window.location.search);
    if(searchParams.has('src') && searchParams.has('dest')) {
        let src = searchParams.get('src'), dest = searchParams.get('dest');
        coords.src_long = src.split(';')[0], coords.src_lat = src.split(';')[1];
        coords.dest_long = dest.split(';')[0], coords.dest_lat = dest.split(';')[1];
        console.log(coords);
    } else {
        alert('Please select a destination');
        window.history.back();
    };
};
function renderElements() {
    $.ajax({
        url: `https://api.mapbox.com/directions/v5/mapbox/driving/${coords.src_long}%2C${coords.src_lat}%3B${coords.dest_long}%2C${coords.dest_lat}?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoiYXBvb3J2ZWxvdXMiLCJhIjoiY2ttZnlyMDgzMzlwNTJ4a240cmEzcG0xNyJ9.-nSyL0Gy2nifDibXJg4fTA`,
        type: "get",
        success: function(response) {
            console.log(response);
            let images = {
                'turn_right': 'ar_right.png',
                'turn_left': 'ar_left.png',
                'slight_right': 'ar_slight_right.png',
                'slight_left': 'ar_slight_left.png',
                'straight': 'ar_straight.png'
            };
            let steps = response.routes[0].legs[0].steps;
            for(let i = 0; i < steps.length; i++) {
                let image, distance, instruction;
                distance = steps[i].distance;
                instruction = steps[i].maneuver.instruction;
                console.log(instruction);
                if(instruction.includes('Turn right')) {
                    image = 'turn_right';
                }
                else if(instruction.includes('Turn left')) {
                    image = 'turn_left';
                };
                if(i > 0) {
                    $('#scene_container').append(
                        `<a-entity gps-entity-place="latitude:${steps[i].maneuver.location[1]};longitude:${steps[i].maneuver.location[0]}">
                            <a-image name="${instruction}" src="./assets/${images[image]}" look-at="#step_${i-1}" scale="5 5 5" position="0 0 0" id="step_${i}"></a-image>
                            <a-entity>
                                <a-text height="50" value="${instruction} (${distance}m)"></a-text>
                            </a-entity>
                        </a-entity>`
                    );
                } else {
                    console.log('i is 0');
                    $('#scene_container').append(
                        `<a-entity gps-entity-place="latitude:${steps[i].maneuver.location[1]};longitude:${steps[i].maneuver.location[0]}">
                            <a-image name="${instruction}" src="./assets/ar_start.png" look-at="#step_${i+1}" scale="5 5 5" position="0 0 0" id="step_${i}"></a-image>
                            <a-entity>
                                <a-text height="50" value="${instruction} (${distance}m)"></a-text>
                            </a-entity>
                        </a-entity>`
                    );
                };
            };
        }
    });
};