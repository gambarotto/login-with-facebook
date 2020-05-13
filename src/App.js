/* eslint-disable no-alert */
import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
//import FBLoginButton from './FBLoginButton';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

import LottieView from 'lottie-react-native';
import fabLottie from './fb.json';

const App = () => {
  const [accessTokenFb, setAccessTokenFb] = useState();
  const [profileFb, setProfileFb] = useState({});
  const [finishedAnimation, setFinishedAnimation] = useState(false);
  const largura = useRef(new Animated.Value(290)).current;
  const altura = useRef(new Animated.Value(45)).current;

  const fbToken = async () => {
    const token = await AccessToken.getCurrentAccessToken();
    if (token) {
      const infoRequest = new GraphRequest(
        '/me?fields=email,name',
        null,
        (error, result) => {
          if (error) {
            console.log('Erro ao buscar dados ', error.toString());
          } else {
            setProfileFb({
              id: result.id,
              name: result.name,
              avatar: `https://graph.facebook.com/${
                result.id
              }/picture?width=200&height=200`,
              email: result.email,
            });
          }
        },
      );

      new GraphRequestManager().addRequest(infoRequest).start();
    }
    setAccessTokenFb(token);
  };

  function animationButton(lar, alt) {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(lar, {
          toValue: 350,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(alt, {
          toValue: 60,
          duration: 150,
          useNativeDriver: false,
        }),
      ]),
      Animated.parallel([
        Animated.timing(lar, {
          toValue: 300,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(alt, {
          toValue: 50,
          duration: 250,
          useNativeDriver: false,
        }),
      ]),
    ]).start(({finished}) => {
      setFinishedAnimation(finished);
    });
  }

  useEffect(() => {
    fbToken();
    animationButton(largura, altura);
  }, [largura, altura]);

  function loginFb() {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function(result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          fbToken();
          animationButton(largura, altura);
        }
      },
      function(error) {
        console.log('Login fail with error: ' + error);
      },
    );
  }

  function logoutFb() {
    LoginManager.logOut();
    setAccessTokenFb(null);
    animationButton(largura, altura);
  }

  return (
    <View style={styles.container}>
      <View style={styles.lottieContainer}>
        {/*<LottieView source={fabLottie} resizeMode="contain" autoPlay />*/}
      </View>
      {accessTokenFb ? (
        <View style={styles.logged}>
          <Image style={styles.avatar} source={{uri: profileFb.avatar}} />
          <Text style={styles.label}>{`Olá ${profileFb.name}`}</Text>
          <Text style={styles.label}>{`${profileFb.email}`}</Text>
          <Animated.View style={{width: largura, height: altura}}>
            <TouchableOpacity style={styles.toBtn} onPress={logoutFb}>
              {finishedAnimation && <Text style={styles.txtBtn}>Logout</Text>}
            </TouchableOpacity>
          </Animated.View>
        </View>
      ) : (
        <Animated.View style={{width: largura, height: altura}}>
          <TouchableOpacity style={styles.toBtn} onPress={loginFb}>
            {finishedAnimation && (
              <Text style={styles.txtBtn}>Login com Facebook</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  lottieContainer: {
    width: 250,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toBtn: {
    borderRadius: 30,
    width: '100%',
    height: '100%',
    backgroundColor: '#4267B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#4267B2',
  },
  logged: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtBtn: {
    color: '#fff',
    fontSize: 20,
  },
  label: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 48,
    alignSelf: 'center',
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});

export default App;
