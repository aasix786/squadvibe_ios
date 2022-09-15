/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import 'react-native-gesture-handler';
import {
  LogBox,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  AppState
} from 'react-native';

import NavigationStack from './source/navigation/Stack';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import CombineReducer from './source/redux/CombineReducer';
import Geolocation from 'react-native-geolocation-service';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setDeviceToken } from './source/redux/Actions/UserAction';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, {Importance} from 'react-native-push-notification';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'user', 'manage_squad'
  ],
  blacklist: [],
};
// const store = createStore(CombineReducer, applyMiddleware(thunk));
const store = createStore(
  persistReducer(persistConfig, CombineReducer),
  applyMiddleware(thunk),
);

const persistor = persistStore(store);

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

messaging().onMessage(async remoteMessage => {
  console.log("Notification onMessage ====> ",remoteMessage);
  // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  // if(AppState.currentState == 'active'){
    if(Platform.OS == 'ios'){
      PushNotificationIOS.addNotificationRequest({
        id: remoteMessage.messageId,
        body: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        userInfo: remoteMessage.data,
      });
    } else {
      console.log("Android");
      PushNotification.localNotification({
        channelId:'com.squadvibe',
        id: remoteMessage.messageId,
        title: remoteMessage.notification.title, // (optional)
        message: remoteMessage.notification.body, // (required)
        userInfo: remoteMessage.data,
        playSound:true,
        soundName:'default',
        importance:'high',
        visibility:'public',
      })        
    }
  // }
});




class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      forceLocation: true,
      highAccuracy: true,
      locationDialog: true,
      significantChanges: false,
      observing: false,
      foregroundService: false,
      useLocationManager: false,
      location: '',
    };
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NavigationStack />
        </PersistGate>
      </Provider>
    );
  }

  componentDidMount() {
    // AsyncStorage.clear()
    // this.requestNotificationPermission();
    this.getFcmToken()
    AsyncStorage.setItem(
      'device_type',
      Platform.OS == 'android' ? 'android' : 'iOS',
    );
    // this.createChannel()
    // this.getLocation();
    // this.getLocationUpdates()
    this.configurePushNotification()
  }

  /* Notification Method */
  configurePushNotification = () => {
    PushNotification.configure({
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions:true
    })

    PushNotification.requestPermissions({
      alert:true,
      badge:false,
      sound:true
    })
    // createChannel()
    if(Platform.OS == 'android'){

      PushNotification.createChannel(
        {
          channelId: "com.squadvibe", // (required)
          channelName: "SquadVibe", // (required)
          channelDescription: "", // (optional) default: undefined.
          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      );

      
      PushNotification.channelExists('com.squadvibe', function (exists) {
        console.log("channel exist =====> ",exists);
      });
    }
  }

  getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        this.setState({ location: position });
        console.log('location ', position);
        let coordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        AsyncStorage.setItem('latitude', coordinate.latitude.toString());
        AsyncStorage.setItem('longitude', coordinate.longitude.toString());
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        this.setState({ location: '' });
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: this.state.highAccuracy,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: this.state.forceLocation,
        forceLocationManager: this.state.useLocationManager,
        showLocationDialog: this.state.locationDialog,
      },
    );
  };

  getLocationUpdates = async () => {
    // const hasPermission = await hasLocationPermission();

    // if (!hasPermission) {
    //   return;
    // }

    // if (Platform.OS === 'android' && this.state.foregroundService) {
    //   await startForegroundService();
    // }

    // setObserving(true);

    Geolocation.watchPosition(
      position => {
        // setLocation(position);
        console.log('location update watchPosition', position);
        let coordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({ location: coordinate });
        AsyncStorage.setItem('latitude', coordinate.latitude.toString());
        AsyncStorage.setItem('longitude', coordinate.longitude.toString());
        Geolocation.stopObserving()
      },
      error => {
        // setLocation(null);
        console.log(error);
        if (error.code == 1){
          // this.locationPermission()
        }
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: this.state.highAccuracy,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
        forceRequestLocation: this.state.forceLocation,
        forceLocationManager: this.state.useLocationManager,
        showLocationDialog: this.state.locationDialog,
        useSignificantChanges: this.state.significantChanges,
      },
    );
  };

  getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("FCM TOken", fcmToken);
      await AsyncStorage.setItem('token', fcmToken)
    }
  }

  requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      // this.getFcmToken();
    }
    this.getFcmToken();
  }

  locationPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always').then(res => {
        console.log('response ', res);
        if (res === 'granted') {
          this.getLocation()
        }
      });
    } else {

      let granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "App Geolocation Permission",
          message: "App needs access to your phone's location.",
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getLocation()
      } else {

        console.log('Location permission not granted!!!!');

      }
    }
  }
};

function createChannel() {
  PushNotification.createChannel(
    {
      channelId: "SquadVibe", // (required)
      channelName: "SquadVibe", // (required)
      channelDescription: "", // (optional) default: undefined.
      playSound: true, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
}


async function hasLocationPermission() {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show(
      'Location permission denied by user.',
      ToastAndroid.LONG,
    );
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG,
    );
  }

  return false;
};

async function hasPermissionIOS() {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    Alert.alert('Location permission denied');
  }

  if (status === 'disabled') {
    Alert.alert(
      `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
      '',
      [
        { text: 'Go to Settings', onPress: openSetting },
        { text: "Don't Use Location", onPress: () => { } },
      ],
    );
  }

  return false;
};

const mapStateToProps = (state) => {
  console.log("redux state", state.user);
  return {
    device_token: state.user.device_token
  };
};

const mapDispatchToProps = (dispatch) => {
  return ({
    
    setDeviceToken: (data) => dispatch(setDeviceToken(data))
  })
}


export default App
