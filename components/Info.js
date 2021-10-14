import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, Dimensions, Modal, Pressable, Button, TouchableOpacity, TouchableWithoutFeedback, Image, Touchable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'
import { ScrollView } from "react-native-gesture-handler";

/* Device dimensions, use to optimize for device of all sizes */
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

/* colors to use */
const colors = {
    lightModeBackground: '#D8F6E0',
    lightModeTile: '#FAFFFA',
    lightModeText: '#4A6050',
};


const Info = (props) => {
 
    return (
        <Modal
          animationType="fade"
          transparent={true}
          visible={props.infoModalVisible}
          onRequestClose={() => {
            props.setInfoModalVisible(!props.infoModalVisible);
          }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.infoModalTitle}>Info</Text>
                    <View style={styles.scrollV}>
                    <ScrollView>
                        <View style={styles.infoModalItem}>
                            <Text style={styles.infoModalItemTitle}>Adding a Log</Text>
                            <Text style={styles.infoModalItemText}>To log hours, press the Add button, then enter the date of log, and enter start time and end time. Tap Save.</Text>
                        </View>

                        <View style={styles.infoModalItem}>
                            <Text style={styles.infoModalItemTitle}>Removing/Editing a Log</Text>
                            <Text style={styles.infoModalItemText}>To edit a log, press the Add button and add hours normally. New log will override old one. To remove a log
                            press the Add button, select date to remove and press Save. </Text>
                        </View>
                        <View style={styles.infoModalItem}>
                            <Text style={styles.infoModalItemTitle}>Export</Text>
                            <Text style={styles.infoModalItemText}>Data logged on this app is stored locally. To move it to a permanent storage click the Export button 
                            and a Excel file will be generated which you can store in a long term storage place. </Text>
                        </View>
                        <View style={styles.infoModalItem}>
                            <Text style={styles.infoModalItemTitle}>About the developer</Text>
                            <Text style={styles.infoModalItemText}>This App was made by Parth Patel. </Text>
                            <Text style={styles.infoModalItemText}>Made with <Image style={styles.inlineImg} source={require('../assets/images/heartIcon.png')}></Image> in Canada </Text>
                        </View>
                    </ScrollView>
                    </View>
                    
                    
                    <View style={styles.bottomList}>
                        <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => props.setInfoModalVisible(!props.infoModalVisible)}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    inlineImg: {
        width: 20,
        height: 20,
    },
    infoModalItem: {
        marginTop: 10,
    },
    scrollV: {
        height: height*0.55,
    },
    infoModalItemText: {
        fontSize: 15,
        fontFamily: 'mp-medium',
        color: colors.lightModeText,
    },
    infoModalItemTitle: {
        fontSize: 20,
        fontFamily: 'mp-bold',
        color: colors.lightModeText,
    },
    infoModalTitle: {
        fontSize: 30,
        fontFamily: 'mp-bold',
        color: colors.lightModeText,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: '#111111cc',
    },
    modalView: {
        backgroundColor: colors.lightModeBackground,
        opacity: 1,
        width: width - 40,
        height: height*0.75,
        margin: 20,
        borderRadius: 20,
        padding: 35,
        // alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 30,
        padding: 12,
        elevation: 2,
        marginLeft: 10,
      },
      buttonOpen: {
        backgroundColor: colors.lightModeText,
      },
      buttonClose: {
          backgroundColor: colors.lightModeText,
      },
      textStyle: {
        color: colors.lightModeBackground,
        textAlign: "center",
        fontFamily: 'mp-bold',
        fontSize: 20,
      },
      
    bottomList: {
        //backgroundColor: '#ccc',
        width: width - 110,
        marginRight: 10,
        height: 40,
        position: 'absolute',
        bottom: 10,
        right: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
  });


export default Info;