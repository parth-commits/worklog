import React, {useState} from "react";
import { StyleSheet, Text, View, Dimensions } from 'react-native';


/* colors to use */
const colors = {
    lightModeBackground: '#D8F6E0',
    lightModeTile: '#f0fff5',// F5FFF6  FFFFFF
    lightModeText: '#4A6050',
};

/* Device dimensions, use to optimize for device of all sizes */
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;



const hourNumberMapping = {
    '01': '01',
    '02': '02',
    '03': '03',
    '04': '04',
    '05': '05',
    '06': '06',
    '07': '07',
    '08': '08',
    '09': '09',
    '10': '10',
    '11': '11',
    '12': '12',
    '13': '01',
    '14': '02',
    '15': '03',
    '16': '04',
    '17': '05',
    '18': '06',
    '19': '07',
    '20': '08',
    '21': '09',
    '22': '10',
    '23': '11',
    '24': '12',
}
const hourAMPMMapping = {
    '01': 'am',
    '02': 'am',
    '03': 'am',
    '04': 'am',
    '05': 'am',
    '06': 'am',
    '07': 'am',
    '08': 'am',
    '09': 'am',
    '10': 'am',
    '11': 'am',
    '12': 'pm',
    '13': 'pm',
    '14': 'pm',
    '15': 'pm',
    '16': 'pm',
    '17': 'pm',
    '18': 'pm',
    '19': 'pm',
    '20': 'pm',
    '21': 'pm',
    '22': 'pm',
    '23': 'pm',
    '24': 'am',
}

const Day = (props) => {
    // if (props.entireObject[props.month][0][props.day][1]) {
        return (
            <View>
                <View style={styles.monthItem}>
                    <View style={styles.monthItemText}>
                        <View style={styles.day01}><Text numberOfLines={1} adjustsFontSizeToFit style={styles.dayItemDate}>{props.entireObject[props.month][0][props.day][0]}, {props.day}</Text></View>
                        <View style={styles.day02}><Text numberOfLines={1} adjustsFontSizeToFit style={styles.dayItemAM}>{hourNumberMapping[props.entireObject[props.month][0][props.day][1].slice(0,2)]}:{props.entireObject[props.month][0][props.day][1].slice(2,4)}{hourAMPMMapping[props.entireObject[props.month][0][props.day][1].slice(0,2)]} - {hourNumberMapping[props.entireObject[props.month][0][props.day][2].slice(0,2)]}:{props.entireObject[props.month][0][props.day][2].slice(2,4)}{hourAMPMMapping[props.entireObject[props.month][0][props.day][2].slice(0,2)]}</Text></View>
                        <View style={styles.day03}><Text numberOfLines={1} adjustsFontSizeToFit style={styles.dayItemTotalHours}>{props.entireObject[props.month][0][props.day][3]} hrs</Text></View>
                    </View>
                </View>
            </View>
        );
    
    
}


const styles = StyleSheet.create({
    monthItem: {
        width: width - 60,
        height: 35,
        marginTop: 4,
        marginLeft: 30,
        marginBottom: 4,
        backgroundColor: colors.lightModeTile,
        borderRadius: 45,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        // elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    monthItemText: {
        width: width - 80,
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: colors.lightModeText,
        alignItems: 'center',
        marginLeft: 10,
        paddingBottom: 4,
    },
    dayItemAM: {
        fontFamily: 'mp-light',
        color: colors.lightModeText,
        fontSize: 17,
    },
    dayItemDate: {
        fontFamily: 'mp-light',
        color: colors.lightModeText,
        fontSize: 16,
    },
    dayItemTotalHours: {
        fontFamily: 'mp-bold',
        fontWeight: 'bold',
        color: colors.lightModeText,
        fontSize: 17,
    },
    datesWrapper: {
        backgroundColor: '#000',
        height: 20,
        width: 100,
    },
    day01: {
        width: 80,
        //backgroundColor: '#ccc'
    },
    day02: {
        width: 140,
        alignItems: 'center',
        //backgroundColor: '#ccc'
    },
    day03: {
        width: 60,
        //backgroundColor: '#ccc',
        alignItems: 'flex-end',
    },
});


export default Day;