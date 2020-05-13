/* eslint-disable no-alert */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
//import FBLoginButton from './FBLoginButton';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {Avatar} from 'react-native-elements';

const App = () => {
  const [accessTokenFb, setAccessTokenFb] = useState();
  const [profileFb, setProfileFb] = useState({});

  const fbToken = async () => {
    const token = await AccessToken.getCurrentAccessToken();
    if (token) {
      const infoRequest = new GraphRequest('/me', null, (error, result) => {
        if (error) {
          console.log('Erro ao buscar dados ', error.toString());
        } else {
          setProfileFb({
            id: result.id,
            name: result.name,
            avatar: `https://graph.facebook.com/${
              result.id
            }/picture?width=200&height=200`,
          });
        }
      });

      new GraphRequestManager().addRequest(infoRequest).start();
    }
    setAccessTokenFb(token);
  };

  useEffect(() => {
    fbToken();
  }, []);

  return (
    <View style={styles.container}>
      {accessTokenFb ? (
        <View>
          <Image style={styles.avatar} source={{uri: profileFb.avatar}} />
          {<Text style={styles.label}>{`Olá ${profileFb.name}`}</Text>}
          <LoginButton
            onLogoutFinished={() => {
              setAccessTokenFb(null);
            }}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.label}>Olá, Faça login</Text>
          <LoginButton
            publishPermissions={['email']}
            onLoginFinished={(error, result) => {
              if (error) {
                alert('Login failed with error: ' + error.message);
              } else if (result.isCancelled) {
                alert('Login was cancelled');
              } else {
                console.log(JSON.stringify(result));
                fbToken();
              }
            }}
          />
        </View>
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
