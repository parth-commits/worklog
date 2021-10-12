import React, {useState} from "react";
import { StyleSheet, Text, View, Dimensions, SafeAreaView, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import Day from './Day';

/* colors to use */
const colors = {
    lightModeBackground: '#D8F6E0',
    lightModeTile: '#FAFFFA',
    lightModeText: '#4A6050',
};

/* Device dimensions, use to optimize for device of all sizes */
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


const Triangle = (props) => {
    return <View style={[styles.triangle, { transform: [{ rotate: props.rot }]}]} />;
};

const monthNumberMapping = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
}

const Month = (props) => {
    const [isVisible, setIsVisible] = useState(false);
    const [rot, setRot] = useState('90deg');
    const renderItem = ({ item }) => {
        return <Day entireObject={props.entireObject} month={props.month} day={item}></Day>;
    }

    let dayKeys = Object.keys(props.entireObject[props.month][0]).sort(function(a, b){return b-a});
    const onPress = () => {
        if (!isVisible) {
            setRot("180deg");
        } else {
            setRot("90deg");
        }
        setIsVisible(!isVisible);
    };

    return (
        <View>
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <View style={styles.monthItem}>
                    <View style={styles.triangleContainer}>
                        <Triangle rot={rot}></Triangle>
                    </View>
                    <View style={styles.monthItemText}>
                        <Text style={styles.monthItemMonthName}>{monthNumberMapping[props.month.slice(4,6)]}, {props.month.slice(0,4)}</Text>
                        <Text style={styles.monthItemTotalHours}>{props.entireObject[props.month][1]} hrs</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <View>
                {isVisible ? <FlatList  data={Object.keys(props.entireObject[props.month][0]).sort(function(a, b){return b-a})} renderItem={renderItem} keyExtractor={item => item} extraData={props.entireObject} /> : null}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    monthItem: {
        width: width - 20,
        height: 45,
        marginTop: 7,
        marginLeft: 10,
        marginBottom: 7,
        backgroundColor: colors.lightModeTile,
        borderRadius: 45,
    
        /* shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1, */
        
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        // elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    triangleContainer: {
        paddingLeft: 15,
        paddingTop: 2,
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 13,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: colors.lightModeText,
        transform: [{ rotate: "0deg" }],
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
    monthItemMonthName: {
        fontFamily: 'mp-medium',
        color: colors.lightModeText,
        fontSize: 20,
    },
    monthItemTotalHours: {
        fontFamily: 'mp-bold',
        fontWeight: 'bold',
        color: colors.lightModeText,
        fontSize: 20,
    },
});


export default Month;
