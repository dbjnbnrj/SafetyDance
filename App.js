import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, Linking } from 'react-native';
import myData from './data.json';
import { Calendar, Permissions, Notifications, Constants } from 'expo';
import { textWithoutEncoding } from 'react-native-communications';

export default class App extends React.Component {

  constructor(props) {

    super(props);

    // Local Notifications
    let t = new Date();
    t.setSeconds(t.getSeconds() + 10);
    const schedulingOptions = {
        time: t, // (date or number) — A Date object representing when to fire the notification or a number in Unix epoch time. Example: (new Date()).getTime() + 1000 is one second from now.
        repeat: true
    };

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      localNotification : {
        title: 'Hello World',
        body: 'This is the notification', // (string) — body text of the notification.
        ios: { // (optional) (object) — notification configuration specific to iOS.
          sound: true // (optional) (boolean) — if true, play a sound. Default: false.
        },
        android: // (optional) (object) — notification configuration specific to Android.
            {
              sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
              //icon (optional) (string) — URL of icon to display in notification drawer.
              //color (optional) (string) — color of the notification icon in notification drawer.
              priority: 'high', // (optional) (min | low | high | max) — android may present notifications according to the priority, for example a high priority notification will likely to be shown as a heads-up notification.
              sticky: false, // (optional) (boolean) — if true, the notification will be sticky and not dismissable by user. The notification must be programmatically dismissed. Default: false.
              vibrate: true // (optional) (boolean or array) — if true, vibrate the device. An array can be supplied to specify the vibration pattern, e.g. - [ 0, 500 ].
              // link (optional) (string) — external link to open when notification is selected.
            }
      },
      schedulingOptions: {
          time: t, // (date or number) — A Date object representing when to fire the notification or a number in Unix epoch time. Example: (new Date()).getTime() + 1000 is one second from now.
      }
    };
  }

  async componentDidMount() {
      let result = await
      Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (Constants.lisDevice && resut.status === 'granted') {
       console.log('Notification permissions granted.');
      }
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {

    deg2rad = (deg) => {
      return deg * (Math.PI/180)
    }

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  }

  getClosestDistance(latitude, longitude) {
    var arr = myData.data.map(p =>{
      for (var key in p) {
          if (p.hasOwnProperty(key) && typeof p[key] == 'object') {
          return this.getDistanceFromLatLonInKm(latitude, longitude, p[key]["latitude"], p[key]["longitude"]);
        }
      }
    });
    var i = arr.indexOf(Math.min(...arr));
    return { 'distance' : arr[i] , 'details': myData.data[i]["293276134"]+"@"+myData.data[i]["293276140"]};
    /* myData.data.map(p =>{
      for (var key in p) {
          if (p.hasOwnProperty(key) && typeof p[key] == 'object') {
          return this.getDistanceFromLatLonInKm(latitude, longitude, p[key].latitude, p[key].longitude);
        }
      }
    });*/
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {

        var obj = this.getClosestDistance(position.coords.latitude, position.coords.longitude);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          distance : obj.distance,
          details: obj.details
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

    this.phoneNumber = "8056377237";

    //const {latitude, longitude }= //getLatLong(myData.data[0]);
    //this.setState( { "distance" : );
  }

  render() {
    return (
      <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Latitude: {this.state.latitude}</Text>
        <Text>Longitude: {this.state.longitude}</Text>
        <Text>Distance: {this.state.distance}</Text>
        <Text>Details: {this.state.details}</Text>
        <Button
            onPress={() => {
               //textWithoutEncoding('+18056377237', `URGENT: ${this.state.details}`);
                Notifications.scheduleLocalNotificationAsync(this.state.localNotification, this.state.schedulingOptions);
            }}
            title="Learn More"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
      </View>
    );
  }
}
