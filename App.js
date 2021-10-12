import React, {useState/*, useEffect*/ } from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, StatusBar, FlatList, TouchableOpacity, Image, Platform, Button, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import Month from './components/Month';
import Add from './components/Add';
import Info from './components/Info';
// import DatePicker from 'react-native-date-picker'

/* Fonts to load */
let customFonts = {
  'mp-light': require('./assets/fonts/Manrope-Light.ttf'),
  'mp-medium': require('./assets/fonts/Manrope-Medium.ttf'),
  'mp-bold': require('./assets/fonts/Manrope-Bold.ttf'),
  'mp-regular': require('./assets/fonts/Manrope-Regular.ttf'),
};

/* colors to use */
const colors = {
  lightModeBackground: '#D8F6E0',
  lightModeTile: '#FAFFFA',
  lightModeText: '#4A6050',
};

/* Device dimensions, use to optimize for device of all sizes */
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


let workLogObjSync = {
  /*'202102': [
    {},
    0],*/
    /*'202110': [
      {
      '03': ['Wed', '1100', '1500', 4],
      '02': ['Tue', '1000', '1400', 14],
      '01': ['Mon', '0900', '1300', 5],
      '07': ['Thu', '0930', '2000', 10.5],
      },
      139],*/
  /*'202110': [
    {
    '03': ['Wed', '1100', '1500', 4],
    '02': ['Tue', '1000', '1400', 14],
    '01': ['Mon', '0900', '1300', 5],
    '07': ['Thu', '0930', '2000', 10.5],
    },
    139],
    '202102': [
    {
    },
    0],
  '202109': [
    {
      '03': ['Wed', '1100', '1500', 8],
      '02': ['Tue', '1000', '1400', 9],
      '01': ['Mon', '0900', '1300', 4],
    },
    280],
  '202108': [
    {
      '03': ['Wed', '1100', '1500', 1],
      '02': ['Tue', '1000', '1400', 3],
      '01': ['Mon', '0900', '1300', 11],
    },
    67],
    '202112': [
      {
        '03': ['Wed', '1100', '1500', 12],
        '02': ['Tue', '1000', '1400', 3],
        '01': ['Mon', '0900', '1300', 6],
      },
      67],*/
};


export default function App() {
  let temp = {};
  const [workLogObj, setworkLogObj] = useState(temp);
  const storeData = async () => {
    try {
      await AsyncStorage.setItem('myWorkLogObject', JSON.stringify(workLogObj));
    } catch (e) {
      console.log('error');
    }
  }
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('myWorkLogObject')
      if(value !== null) {
        console.log('hi')
        // value previously stored
        setworkLogObj(JSON.parse(value));
      } else {
        let temp2 = {};
        setworkLogObj(temp2);
      }
      setrefreshList(!refreshList);
    } catch(e) {
      // error reading value
      console.log('error');
    }
  }

  // Load in the fonts
  let [fontsLoaded] = useFonts(customFonts);
  Font.loadAsync(customFonts);
  
  // Hide the status bar, probably only for android
  StatusBar.setHidden(true);

  /* States*/
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [refreshList, setrefreshList] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  

  /* The month render item */
  const renderItem = ({ item }) => {
    return <Month entireObject={workLogObj} month={item}></Month>;
  }

  const onPressRefresh = () => {
    setrefreshList(!refreshList);
    getData();
    console.log(workLogObj);
  };


  /* If fonts havent loaded, returns loading screen, else returns real screen */
  if (!fontsLoaded || !loadedData) {
    return <AppLoading startAsync={getData} onError={console.log('dumb error')} onFinish={() => setLoadedData(true)} />;
  } else {
    return (
      <SafeAreaView style={styles.pageStyle}>
        {addModalVisible && (<Add storeData={storeData} refreshList={refreshList} setrefreshList={setrefreshList} workLogObj={workLogObj} setworkLogObj={setworkLogObj} addModalVisible={addModalVisible} setAddModalVisible={setAddModalVisible}></Add>)}
        {infoModalVisible && (<Info infoModalVisible={infoModalVisible} setInfoModalVisible={setInfoModalVisible}></Info>)}
        <Text style={styles.appTitle}>Work Log</Text>
        <FlatList data={Object.keys(workLogObj).sort(function(a, b){return b-a})} renderItem={renderItem} keyExtractor={item => item} extraData={refreshList} />
        <View style={styles.navBar}>
          <View style={styles.navBarButtons}>
            <TouchableOpacity style={styles.navBarButton}  activeOpacity={0.7}  onPress={() => setInfoModalVisible(true)}>
              <View style={styles.navBarButtonIcon}>
                <Image style={styles.navBarButtonIconImage} source={require('./assets/images/InfoIcon.png')}></Image>
              </View>
              <Text numberOfLines={1} adjustsFontSizeToFit  style={styles.navBarText}>Info</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBarButton}  activeOpacity={0.7}>
              <View style={styles.navBarButtonIcon}>
                <Image style={styles.navBarButtonIconImage} source={require('./assets/images/ExportIcon.png')}></Image>
              </View>
              <Text  numberOfLines={1} adjustsFontSizeToFit style={styles.navBarText}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBarButton}  activeOpacity={0.7} onPress={onPressRefresh}>
              <View style={styles.navBarButtonIcon}>
                <Image style={styles.navBarButtonIconImage} source={require('./assets/images/RefreshIcon.png')}></Image>
              </View>
              <Text numberOfLines={1} adjustsFontSizeToFit  style={styles.navBarText}>Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBarButton}  activeOpacity={0.7} onPress={() => setAddModalVisible(true)}>
              <View style={styles.navBarButtonIcon}>
                <Image style={styles.navBarButtonIconImage} source={require('./assets/images/AddIcon.png')}></Image>
              </View>
              <Text numberOfLines={1} adjustsFontSizeToFit  style={styles.navBarText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

  pageStyle: {
    flex: 1,
    backgroundColor: colors.lightModeBackground,
    paddingTop: StatusBar.currentHeight || 0,
  },
  appTitle: {
    paddingLeft: 25,
    color: colors.lightModeText,
    fontFamily: 'mp-bold',
    fontSize: 45,
    marginBottom: 10,
  },
  navBar: {
    width: width,
    height: 90,
    backgroundColor: colors.lightModeBackground,
    elevation: 30,
  },
  navBarButtons: {
    width: width-20,
    marginLeft: 10,
    height: 70,
    marginTop: 10,
    flexDirection: 'row',
  },
  navBarButton: {
    textAlignVertical: 'bottom',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: (width-40-20)/4,
    height: 60,
    marginTop: 5,
    margin: 5,
    // backgroundColor: '#ccc',
    fontSize: 10,
  },
  navBarText: {
    fontSize: 20,
    fontFamily: 'mp-bold',
    color: colors.lightModeText,
    height: 20,
    // backgroundColor: '#333',
  },
  navBarButtonIcon: {
    width: 40,
    height: 40,
    // backgroundColor: colors.lightModeText,
    borderRadius: 20,
  },
  navBarButtonIconImage: {
    width: 40,
    height: 40,
  }
});
