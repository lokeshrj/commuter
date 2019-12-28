const { app, Menu, powerMonitor, Tray } = require("electron");
const {
  workAddress,
  homeAddress,
  pollIntervalMinutes,
  morningCommuteStartTime,
  morningCommuteEndTime,
  eveningCommuteStartTime,
  eveningCommuteEndTime,
  commuteDays,
  googleMapsAPIKey
} = require("./config");
const fetch = require("node-fetch");

let tray = null;

const inMorningCommuteHours = () => {
  // true if current time is in morning commute hours
  let today = new Date();
  let timenow = today.getHours();
  let day = today.getDay();
  if (timenow >= morningCommuteStartTime && timenow < morningCommuteEndTime && commuteDays.indexOf('' + day) > -1) {
    return true;
  }
  return false;
};

const inEveningCommuteHours = () => {
  // true if current time is in evening commute hours
  let today = new Date();
  let timenow = today.getHours();
  let day = today.getDay();
  debugger;
  if (timenow >= eveningCommuteStartTime && timenow < eveningCommuteEndTime && commuteDays.indexOf('' + day) > -1) {
    return true;
  }
  return false;
};

const getBaseIcon = () => {
  return inMorningCommuteHours()
    ? "./icons/work-briefcase_icon-icons.com_72464@2x.png"
    : inEveningCommuteHours()
    ? "./icons/home_icon-icons.com_73532@2x.png"
    : "./icons/trafficjam_trafic_13247@2x.png";
};

const encode = str => str.split(" ").join("+");

function queryDrivingTimeInTraffic(origin, destination) {
  return fetch(
    `https://maps.googleapis.com/maps/api/directions/json?origin=${encode(
      origin
    )}&destination=${encode(
      destination
    )}&departure_time=now&key=${googleMapsAPIKey}`
  )
    .then(response => response.json())
    .then(data => data.routes[0].legs[0].duration_in_traffic.text);
}

function update() {
  if (inMorningCommuteHours() || inEveningCommuteHours()) {
    let origin, destination;
    inMorningCommuteHours()
      ? ([origin, destination] = [homeAddress, workAddress])
      : ([origin, destination] = [workAddress, homeAddress]);
    queryDrivingTimeInTraffic(origin, destination).then(duration => {
      tray.setTitle(duration);
    });
  } else {
    tray.setTitle("");
  }
  tray.setImage(getBaseIcon());
}

const startPolling = () => setInterval(update, pollIntervalMinutes * 60 * 1000);

app.on("ready", () => {
  tray = new Tray(getBaseIcon());
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Quit",
      click: () => {
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
  app.dock.hide();
  let interval = startPolling();

  // power events
  powerMonitor.on("resume", () => {
    update();
  });
  powerMonitor.on("lock-screen", () => {
    clearInterval(interval);
  });
  powerMonitor.on("unlock-screen", () => {
    interval = startPolling();
  });

  update();
});