// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';
import fs from 'fs';
import { error } from 'console';

let loggedIn = false;
let loggedInUser = '';
console.log('Test')

const showsResponse = await fetch('https://fdnd-agency.directus.app/items/mh_shows');
const showsResponseJSON = await showsResponse.json();

const showResponse = await fetch('https://fdnd-agency.directus.app/items/mh_show');
const showResponseJSON = await showResponse.json();

const uniqueAllUsersResponse = await fetch('https://fdnd-agency.directus.app/items/mh_users?groupBy=full_name');
const uniqueAllUsersResponseJSON = await uniqueAllUsersResponse.json();

const radiostationsResponse = await fetch('https://fdnd-agency.directus.app/items/mh_radiostations?sort=id');
const radiostationsResponseJSON = await radiostationsResponse.json();

const chatsResponse = await fetch('https://fdnd-agency.directus.app/items/mh_chats');
const chatsResponseJSON = await chatsResponse.json();

// Maak multi demsionele array aan met id van station en de naam
const radiostations = radiostationsResponseJSON.data.map(station => ({
  id: station.id,
  name: station.name
}));

// console.log(showsResponseJSON);
// console.log(showResponseJSON);
// console.log(usersResponseJSON);
// console.log(radiostationsResponseJSON);
// console.log(chatsResponseJSON);

// console.log(radiostations);





// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express());

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

// Maak een GET route voor de index (meestal doe je dit in de root, als /)
app.get('/', async function (request, response) {
  response.render('index.liquid', { radiostations: radiostationsResponseJSON.data })
})


app.get('/error', async function (request, response) {
  response.render('error.liquid', { error: request.query.error, radiostations: radiostationsResponseJSON.data });
})

app.get('/test', async function (request, response) {
  response.render('test.liquid');
})


// https://www.npmjs.com/package/path-to-regexp#optional - Optional parameters
app.get('/station/:name/programmering{/:dayname}', async function (request, response) {
  const dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

  const thisWeekshows = [];
  let daysResponse;
  let dayID;
  if (request.params.dayname == undefined) {
    daysResponse = await fetch('https://fdnd-agency.directus.app/items/mh_day?fields=*,shows.mh_shows_id.show');
  }
  else {
    dayID = dayNames.findIndex(day => day === request.params.dayname);
    console.log(dayID);
    daysResponse = await fetch('https://fdnd-agency.directus.app/items/mh_day?fields=*,shows.mh_shows_id.show&filter={"sort":"' + dayID + '"}');
  }
  const daysResponseJSON = await daysResponse.json();

  daysResponseJSON.data.forEach(day => {
    const genDate = new Date(day.date);
    const dayofWeekJSON = genDate.getDay();
    const shows = day.shows;
    const showIDs = [];
    shows.forEach(show => {
      const show_id = show.mh_shows_id.show;
      showIDs.push(show_id);
    });
    thisWeekshows.push({
      day: dayofWeekJSON,
      dayName: dayNames[dayofWeekJSON],
      shows: showIDs
    });
  });
  // console.log(thisWeekshows);
  // console.log("dit waren alle shows gesoorteerd op dag");

  const now = new Date()
  let startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 5)
  // DAGEN VAN DEZE WEEK voor sticky dates
  const thisWeek = [];

  // Chat GPT-3
  function getDatesOfCurrentWeek(refDate = new Date()) {

    const datesOfWeek = [];
    for (let i = 0; i < 8; i++) { // Loop through 8 days to include next Monday
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      console.log(date);
      datesOfWeek.push(date);
    }

    return datesOfWeek;
  }

  const datesOfCurrentWeek = getDatesOfCurrentWeek();
  datesOfCurrentWeek.forEach(date => {
    const dateString = date.toISOString().split('T')[0];
    thisWeek.push({
      day: dateString.split('-')[2],
      dayOfWeek: date.getDay()
    });
  });

  // End of Chat GPT code




  const stationArr = request.params.name;
  const stationURL = radiostations.find(station => station.name === stationArr);
  let stationID = stationURL.id;
  const ShowsforStationUL = "https://fdnd-agency.directus.app/items/mh_shows?fields=*.*.*.*";
  const showsforStationFilterPart = "&filter={\"show\":{\"radiostation\":{\"id\":\"" + stationID + "\"}}}&limit=-1";


  const showsforStation = await fetch(ShowsforStationUL + showsforStationFilterPart);
  const showsforStationJSON = await showsforStation.json();
  const nestedShows = [];

  showsforStationJSON.data.forEach(function (show) {

    nestedShows.push({
      ...show.show,
      from: show.from,
      until: show.until,
    });
  });
  nestedShows.sort((a, b) => new Date(a.from) - new Date(b.from));

  const updatedWeekShowsforStation = thisWeekshows.map(day => {
    const updatedShows = day.shows
      .filter(show => show !== undefined && show !== null) // Filter out null values before mapping
      .map(show => {

        // console.log("Processing show ID: " + show);
        let dayShowID = show;
        const showObj = nestedShows.find(s => s.id == dayShowID);
        return showObj;
      })
      .filter(show => show !== undefined && show !== null);// Hiermee map je als het door de array heen, en filter je de nulls eruit.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    updatedShows.sort((a, b) => a.from.localeCompare(b.from));
    return { ...day, shows: updatedShows };
  });
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  // Het feit dat ik een updated array moest maken met de spread operator heb ik van Chat. Ik snap wel dat het de day object pakt en de shows array updated met de juiste shows, maar had dit niet zelf bedacht. Ik snap nog niet helemaal hoe het werkt.


  // console.log("Updated week shows for station:", updatedWeekShowsforStation[1]);

  // Write the updatedWeekShowsforStation data to test.json
  fs.writeFile('test.json', JSON.stringify(updatedWeekShowsforStation, null, 2), (err) => {
    if (err) {
      console.error('Error writing to test.json:', err);
    } else {
      console.log('Successfully wrote to test.json');
    }
  });
  let today;
  let todayName;
  if (request.params.dayname == undefined) {
    today = parseInt(thisWeekshows[0].day);  // Parse the day from thisWeekshows
    todayName = dayNames[today];
  } else {
    today = dayID;  // Parse the dayid from the request params

  }

  response.render('station.liquid', {
    showsforStation: showsforStationJSON.data,
    stationNameGenerated: stationArr,
    stationNameGeneratedEncoded: encodeURIComponent(stationArr),
    thisWeek: thisWeek,
    dayNames: dayNames,
    thisWeekShows: updatedWeekShowsforStation,
    radiostations: radiostationsResponseJSON.data,
    thisstation: stationID,
    today: today,
    todayName: request.params.dayname
  });
});


app.get('/station/:name/djs{/likeStatus/:likeStatus}', async function (request, response) {

  const stationArr = request.params.name;
  const stationURL = radiostations.find(station => station.name === stationArr);
  if (stationURL == undefined) {
    response.redirect(303, '/error?error=noStation');
  }
  let stationID = stationURL.id;
  // alle djs voor huidige radiostation
  const userInfo = "https://fdnd-agency.directus.app/items/mh_shows?fields=show.users.mh_users_id.*,show.users.mh_show_id.*";
  const userInfoFilterPart = "&filter={\"show\":{\"radiostation\":{\"id\":\"" + stationID + "\"}}}&limit=-1";
  const completeUserFetch = await fetch(userInfo + userInfoFilterPart);
  const userInfoJSON = await completeUserFetch.json();


  //alle unieke djs voor huidig radiostation - CHAD
  function UniqueUsersForStation() {
    var keys = userInfoJSON.data.map(function (value) {
      return value.show.users.map(user => user.mh_users_id.full_name).join(",");
    });

    return userInfoJSON.data.filter(function (value, index) {
      return keys.indexOf(value.show.users.map(user => user.mh_users_id.full_name).join(",")) === index;
    });
  }
  var distinctShows = UniqueUsersForStation();
  var distinctDJs = distinctShows.flatMap(show => show.show.users)
    .filter((user, index, self) =>
      index === self.findIndex(u => u.mh_users_id.id === user.mh_users_id.id)
    );
  // END OF CHAD




  for (let i = 0; i < distinctDJs.length; i++) {
    let onedj_id = distinctDJs[i].mh_users_id.id;
    // haal alle likes op van de huidige dj
    const likesForPersonResponse = await fetch(`https://fdnd-agency.directus.app/items/mh_messages/?filter[for][_eq]=Dylan/Like/UserID/` + onedj_id)
    const likesForPersonResponseJSON = await likesForPersonResponse.json();
    let likesData = likesForPersonResponseJSON.data;
    // voeg de likes toe aan de dj objecten
    distinctDJs[i].likes = likesForPersonResponseJSON.data.length;

    var userString = "UserLoggedin/" + loggedInUser;
    var result = likesData.find(({ from }) => userString == from);
    if (result != undefined) {
      distinctDJs[i].likedByThisUser = true;
    } else {
      distinctDJs[i].likedByThisUser = false;
    }
  }







  
  fs.writeFile('test.json', JSON.stringify(distinctDJs, null, 2), (err) => {
    if (err) {
      console.error('Error writing to test.json:', err);
    } else {
      console.log('Successfully wrote to test.json');
    }
  });  
  console.log(request.params);
  if (request.params.likeStatus){
    let likeStatus = parseInt(request.params.likeStatus);
    if(likeStatus == 204) {
      likeStatus = 200;
    }
    console.log(likeStatus);
    response.status(likeStatus);
  }
  response.render('deejays.liquid', {
    stationNameGenerated: stationArr,
    stationNameGeneratedEncoded: encodeURIComponent(stationArr),
    radiostations: radiostationsResponseJSON.data,
    thisstation: stationID,
    deejays: distinctDJs,
    loggedIn: loggedIn,
    LoggedInUser: loggedInUser,
  });
});
app.use(express.urlencoded({ extended: true }));
app.post('/login/:name', function (request, response) {
  loggedIn = true;
  loggedInUser = request.body.username;
  response.redirect(303, '/station/' + request.params.name + '/djs')
})
app.get('/logout/:name', function (request, response) {
  loggedIn = false;
  loggedInUser = '';
  response.redirect(303, '/station/' + request.params.name + '/djs')
})


app.post("/station/:name/djs/like/:id", async function (request, response) {
  if (loggedInUser != "") {
    loggedInUser = loggedInUser;
  }
  else {
    loggedInUser = "Onbekende gebruiker";
  }
  
  // Deze link is nu legitiem (200 status) maar als je de link aanpast naar een ongeldige endpoint krijg je een 403 error.
  const likeResponse = await fetch("https://fdnd-agency.directus.app/items/mh_messages/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      for: `Dylan/Like/UserID/` + request.params.id,
      from: "UserLoggedin/" + loggedInUser,
      text: "Like",
    }),

  });
  console.log("status in server" + likeResponse.status);
  response.redirect(303, "/station/" + request.params.name + "/djs/likeStatus/" + likeResponse.status);
})



app.post("/station/:name/djs/unlike/:id", async function (request, response) {
  if (loggedInUser != "") {
    loggedInUser = loggedInUser;
  }
  else {
    loggedInUser = "Onbekende gebruiker";
  }

  const compareData = await fetch(
    `https://fdnd-agency.directus.app/items/mh_messages/?filter={"for":"Dylan/Like/UserID/` + request.params.id + `"}`,
  );
  const compareJson = await compareData.json();

  // vergelijking, als het bestaat, pak de id en delete gebaseerd hierop
  const itemToDelete = compareJson.data.find(
    (person) => person.from === "UserLoggedin/" + loggedInUser
  )?.id;

  if (itemToDelete) {
    const deleteResponse = await fetch(`https://fdnd-agency.directus.app/items/mh_messages/${itemToDelete}?filter={"for":"Dylan/Like/UserID/` + request.params.id + `"}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    console.log("status in server" + deleteResponse.status);
    response.redirect(303, "/station/" + request.params.name + "/djs/likeStatus/" + deleteResponse.status);
  }
});

  // Stel het poortnummer in waar Express op moet gaan luisteren
  // Lokaal is dit poort 8000, als dit ergens gehost wordt, is het waarschijnlijk poort 80
  app.set('port', process.env.PORT || 2000)

  // Start Express op, haal daarbij het zojuist ingestelde poortnummer op
  app.listen(app.get('port'), function () {
    // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
  })



// https://codesandbox.io/embed/throbbing-flower-ncm0q