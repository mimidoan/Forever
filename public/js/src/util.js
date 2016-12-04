/*
      ___          ___          ___          ___         ___          ___          ___     
     /\  \        /\  \        /\  \        /\  \       /\__\        /\  \        /\  \    
    /::\  \      /::\  \      /::\  \      /::\  \     /:/  /       /::\  \      /::\  \   
   /:/\:\  \    /:/\:\  \    /:/\:\  \    /:/\:\  \   /:/  /       /:/\:\  \    /:/\:\  \  
  /::\~\:\  \  /:/  \:\  \  /::\~\:\  \  /::\~\:\  \ /:/__/  ___  /::\~\:\  \  /::\~\:\  \ 
 /:/\:\ \:\__\/:/__/ \:\__\/:/\:\ \:\__\/:/\:\ \:\__\|:|  | /\__\/:/\:\ \:\__\/:/\:\ \:\__\
 \/__\:\ \/__/\:\  \ /:/  /\/_|::\/:/  /\:\~\:\ \/__/|:|  |/:/  /\:\~\:\ \/__/\/_|::\/:/  /
      \:\__\   \:\  /:/  /    |:|::/  /  \:\ \:\__\  |:|__/:/  /  \:\ \:\__\     |:|::/  / 
       \/__/    \:\/:/  /     |:|\/__/    \:\ \/__/   \::::/__/    \:\ \/__/     |:|\/__/  
                 \::/  /      |:|  |       \:\__\      ~~~~         \:\__\       |:|  |    
                  \/__/        \|__|        \/__/                    \/__/        \|__|    
Forever - Algorithmic Composition - Client side Util lib
Wrriten by juniorxsound (http://phenomenalabs.com)
*/

function introduction(socket, who){

	if(who == 'player'){

 		socket.emit('introduction', 'player');

 		console.log('Hi Player, you are connected to the server');

 	} else if (who == 'conductor'){

 		socket.emit('introduction', 'conductor');

 		console.log('Hi Conductor, you are connected to the server');

 	} else {

 		console.log('Error, user type not defined you are not connected to the server');

 	}

}

function userCounter(print, count, div){

  console.log('There are currently ' + count + ' users connected');

  if( print === true ){

      users = count;

  		//Get the users paragraph and print the user to it
  		document.getElementById(div).innerHTML = count;

  }

}

function getGeoPosition(print, div){

	if (navigator.geolocation) {

	    navigator.geolocation.getCurrentPosition(function ( pos ) {

	    		socket.emit('geolocation', pos.coords.latitude + "," + pos.coords.longitude);

                if(print){

                	document.getElementById(div).innerHTML = 'Lat: ' + pos.coords.latitude + ' Long: ' + pos.coords.longitude;

                }
    	});

	} else {

	    document.getElementById('error').innerHTML = "Oops, Sorry but it seems your browser doesn't support Geo location, download Chrome?"

	}

}

function changeFreq(){

  var selector = random(0, pentatonicMin.length);

  freq = midiToFreq(pentatonicMin[selector]);

  osc.freq(freq);

}

function deg2rad(deg) {

   var rad = deg * Math.PI/180;

   return Math.tan(rad);

}

function mercator(lat) {

  return Math.log(Math.tan(Math.PI / 4 + lat / 2));

} 

function initGuiParams() {

  //Mapping
  this.Xscaler = 1000;
  this.Yscaler = 1000;

  //Playback
  this.playSpeed = 0.5;

}

function initGui(){
      // DatGui Stuff
    window.onload = function(){

      guiParams = new initGuiParams();

      var gui = new dat.GUI();

      var mapping = gui.addFolder('Mapping');

      mapping.add(guiParams, 'Xscaler', 500, 2000);

      mapping.add(guiParams, 'Yscaler', 500, 2000);

      var playback = gui.addFolder('Playback');

      playback.add(guiParams, 'playSpeed', 0, 10);

    }
}

function initMap(){
    //Mapbox API token
    mapboxgl.accessToken = 'pk.eyJ1IjoianVuaW9yeHNvdW5kIiwiYSI6ImNpdnlyMG9hZjAyamwydHRhNGRqZ3BhZGQifQ.hIDvif6XFSretP-RSqBtHQ';

    //Create a new map object
    mapboxmap = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/juniorxsound/ciw3v1jb300292jr1pf3y40c5', //stylesheet location
      center: [-73.98, 40.74278],
      zoom: 11, // starting zoom
      zoomControl: false
    });

    //Setup event listeners and invterval to refetch the users
    mapboxmap.on('load', function () {
      window.setInterval(function() {
          mapboxmap.getSource('drone').setData(mapboxusers);
      }, 2000);

      //Add the users layer to the map
      mapboxmap.addSource('drone', { type: 'geojson', data: mapboxusers });

      //Instead of using the mapbox API to draw the users I amp these locations with p5.js and draw the users in the draw function
      // mapboxmap.addLayer({
      //     "id": "drone",
      //     "type": "symbol",
      //     "source": "drone",
      //     "layout": {
      //         "icon-image": "rocket-15"
      //     }
      // });
  });

}

function initOscilator(){

    pentaFreq = [];

    for(var i = 0; i < pentatonicMin.length; i++){

      pentaFreq.push(midiToFreq(pentatonicMin[i]));
      
    }

    //Reverbs
    var reverb1 = new p5.Reverb();
    var reverb2 = new p5.Reverb();

    //Delays
    var delay1 = new p5.Delay();
    var delay2 = new p5.Delay();

    //Envelope
    env1 = new p5.Env(0.1, 0.2, 0.2, 0.1);
    env1.setRange(0.6, 0);

    env2 = new p5.Env(0.1, 0.2, 0.2, 0.1);
    env2.setRange(1.0, 0);

    //Oscilator
    SQRosc = new p5.Oscillator('square');

    SNosc = new p5.Oscillator('sine');

    //Processing chains and parameters
    reverb1.process(SQRosc, 10, 5, true);
    delay1.process(reverb1, 0.12, 0.7, 2300);

    reverb2.process(SNosc, 5, 10);
    delay2.process(reverb2, 0.12, 0.9, 2300, true);

    //Init

    SQRosc.start();

    SQRosc.amp(0);

    SNosc.start();

    SNosc.amp(0);


}

function changeNote(){

    var frequenci = 0;

    // osc.stop();

    //Iterate over all the users pixel position to determine note height
    for(var z = 0; z < canvasLocations.length; z++){

      var xy = canvasLocations[z];

      //Only console log the Y position of the current note
      if(parseInt(transportLine) == parseInt(xy[0])){

          if(xy[1] > 0 && xy[1] < height/5){
            console.log('1st Area');

            frequenci = pentaFreq[round(random(12, 14))];

            SQRosc.freq(frequenci, 0.01);
            SNosc.freq(frequenci, 0.01);


          } else if (xy[1] > height/5 && xy[1] < (height/5)*2){
            console.log('2nd Area');

            frequenci = pentaFreq[round(random(9, 11))];

            SQRosc.freq(frequenci, 0.01);
            SNosc.freq(frequenci, 0.01);

          } else if (xy[1] > (height/5)*2 && xy[1] < (height/5)*3){
            console.log('3rd Area');

            frequenci = pentaFreq[round(random(6, 8))];

            SQRosc.freq(frequenci, 0.01);
            SNosc.freq(frequenci, 0.01);


          } else if (xy[1] > (height/5)*3 && xy[1] < (height/5)*4){
            console.log('4th Area');

            frequenci = pentaFreq[round(random(3, 5))];

            SQRosc.freq(frequenci, 0.01);
            SNosc.freq(frequenci, 0.01);


          } else if (xy[1] > (height/5)*4 && xy[1] < height){
            console.log('5th Area');

            frequenci = pentaFreq[round(random(0, 2))];

            SQRosc.freq(frequenci, 0.01);
            SNosc.freq(frequenci, 0.01);


          } else {
            console.log('You are currently not in the map, sorry');
          }

            // console.log(Math.round(xy[1]));

      }

    }

}

function hitNote(){

  env1.play(SQRosc);
  // env2.play(SNosc);

}