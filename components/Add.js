import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, Dimensions, Modal, Pressable, Button, TouchableOpacity, TouchableWithoutFeedback, Image, Touchable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'

/* Device dimensions, use to optimize for device of all sizes */
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

/* colors to use */
const colors = {
    lightModeBackground: '#D8F6E0',
    lightModeTile: '#FAFFFA',
    lightModeText: '#4A6050',
  };

const hourNumberMapping = {
    '00': '12',
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
const dateToDayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const numberMappingTo2Digits = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

const Add = (props) => {
    const [date, setDate] = useState(new Date());
    const [date2, setDate2] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    
    const d = new Date();
    const [dayNumber, setDayNumber] = useState(numberMappingTo2Digits[d.getDate()]);
    const [dayOfWeek, setdayOfWeek] = useState(dateToDayMap[d.getDay()]);
    const [monthNumber, setmonthNumber] = useState(numberMappingTo2Digits[d.getMonth()+1]);
    const [yearNumber, setYearNumber] = useState(d.getFullYear());
    const [hour24, setHour24] = useState(numberMappingTo2Digits[d.getHours()]);
    const [hour12, setHour12] = useState(hourNumberMapping[d.getHours()]);
    const [minute, setMinutes] = useState(numberMappingTo2Digits[d.getMinutes()]||d.getMinutes());
    const [endhour24, setEndHour24] = useState(numberMappingTo2Digits[d.getHours()]);
    const [endhour12, setEndHour12] = useState(hourNumberMapping[d.getHours()]);
    const [endminute, setEndMinutes] = useState(numberMappingTo2Digits[d.getMinutes()]||d.getMinutes());
    
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    }
    const showMode2 = () => {
        setShow2(true);
    }

    /* Sets the starting time and its states */
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        const tempDate = new Date(currentDate);
        setDayNumber(numberMappingTo2Digits[tempDate.getDate()]);
        setdayOfWeek(dateToDayMap[tempDate.getDay()]);
        setmonthNumber(numberMappingTo2Digits[tempDate.getMonth()+1]);
        setYearNumber(tempDate.getFullYear());
        setHour24(numberMappingTo2Digits[tempDate.getHours()]);
        setHour12(hourNumberMapping[numberMappingTo2Digits[tempDate.getHours()]]);
        setMinutes(numberMappingTo2Digits[tempDate.getMinutes()]||tempDate.getMinutes());
    }

    /* Sets the ending time */
    const onChange2 = (event, selectedDate) => {
        const currentDate = selectedDate || date2;
        setShow2(Platform.OS === 'ios');
        setDate2(currentDate);

        let tempDate = new Date(currentDate);
        setEndHour24(numberMappingTo2Digits[tempDate.getHours()]);
        console.log(`time :  ${tempDate.getHours()}`)
        setEndHour12(hourNumberMapping[numberMappingTo2Digits[tempDate.getHours()]]);
        setEndMinutes(numberMappingTo2Digits[tempDate.getMinutes()]||tempDate.getMinutes());
    }
    
    const onSave = () => {
        const totalHours = Math.round(((parseInt(endhour24)*60 + parseInt(endminute))-(parseInt(hour24)*60 + parseInt(minute)))/6)/10;
        if (totalHours >= 0) {
            let tempObj = props.workLogObj;
            const yearMonth = yearNumber.toString() + monthNumber;
            const dateNum = dayNumber;
            const start = hour24 + minute.toString();
            const end = endhour24 + endminute.toString();
            if (totalHours === 0) {

                if (tempObj[yearMonth]!== undefined  && tempObj[yearMonth][0]!== undefined  && tempObj[yearMonth][0][dateNum]!== undefined) {
                    const currDatesHours = tempObj[yearMonth][0][dateNum][3];
                    delete tempObj[yearMonth][0][dateNum];
                    tempObj[yearMonth][1] = tempObj[yearMonth][1] - currDatesHours;
                    if (tempObj[yearMonth][1] === 0) {
                        // this only happens if you remove all dates from month
                        delete tempObj[yearMonth];
                    }
                    props.setworkLogObj(tempObj);
                    props.storeData();
                    props.setrefreshList(!props.refreshList);
                }
            } else {
                if (tempObj[yearMonth]) {
                    // year month exists
                    if (tempObj[yearMonth][0][dateNum]) {
                        // date already exists
                        const currDatesHours = tempObj[yearMonth][0][dateNum][3];
                        tempObj[yearMonth][0][dateNum] = [dayOfWeek, start, end, totalHours];
                        tempObj[yearMonth][1] = tempObj[yearMonth][1] - currDatesHours + totalHours;
                        props.setworkLogObj(tempObj);
                        props.storeData();
                        props.setrefreshList(!props.refreshList);

                    } else {
                        // month year exist, but date dont
                        tempObj[yearMonth][0][dateNum] = [dayOfWeek, start, end, totalHours];
                        tempObj[yearMonth][1] = tempObj[yearMonth][1] + totalHours;
                        props.setworkLogObj(tempObj);
                        props.storeData();
                        props.setrefreshList(!props.refreshList);
                    }
                } else {
                    // year month doesnt exist, add it in
                    let smallObj = {};
                    smallObj[dateNum] = [dayOfWeek, start, end, totalHours];
                    let mediumArr = [smallObj, totalHours];
                    tempObj[yearMonth] = mediumArr;
                    props.setworkLogObj(tempObj);
                    props.storeData();
                    props.setrefreshList(!props.refreshList);
                }
            }
            props.setAddModalVisible(!props.addModalVisible)
        } else {
            props.setAddModalVisible(!props.addModalVisible)
        }
    }
    
    return (
        <Modal
          animationType="fade"
          transparent={true}
          visible={props.addModalVisible}
          onRequestClose={() => {
            props.setAddModalVisible(!props.addModalVisible);
          }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{height: 20}}></View>
                    <Text style={styles.addModalText}>Start</Text>
                    <View style={styles.addModalEntryList}>
                        <Image style={styles.addModalIcons} source={require('../assets/images/DateIcon.png')}></Image>
                        <TouchableOpacity style={styles.addModalDateEntry} onPress={() => showMode('date')}>
                            <Text style={styles.addModalDateText}>{dayOfWeek} {dayNumber}/{monthNumber}/{yearNumber}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.addModalEntryList}>
                        <Image style={styles.addModalIcons} source={require('../assets/images/TimeIcon.png')}></Image>
                        <TouchableOpacity style={styles.addModalDateEntry} onPress={() => showMode('time')}>
                        <Text style={styles.addModalDateText}>{hour24}:{minute}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: 40}}></View>
                    <Text style={styles.addModalText}>Finish</Text>
                    <View style={styles.addModalEntryList}>
                        <Image style={styles.addModalIcons} source={require('../assets/images/TimeIcon.png')}></Image>
                        <TouchableOpacity style={styles.addModalDateEntry} onPress={() => showMode2()}>
                            <Text style={styles.addModalDateText}>{endhour24}:{endminute}</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.totalHours}>
                        <Image style={styles.addModalTotalHoursIcons} source={require('../assets/images/TotalHoursIcon.png')}></Image>
                        <Text style={styles.totalHoursText}>{Math.round(((parseInt(endhour24)*60 + parseInt(endminute))-(parseInt(hour24)*60 + parseInt(minute)))/6)/10} Hours</Text>
                    </View>
                    <View style={styles.bottomList}>
                        <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => props.setAddModalVisible(!props.addModalVisible)}
                        >
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>
                        <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => onSave()}
                        >
                            <Text style={styles.textStyle}> Save </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            {show && (<DateTimePicker
                testID='dateTimePicker'
                value={date}
                mode={mode}
                is24Hour={false}
                display='default'
                onChange={onChange}
                />)}
            
            {show2 && (<DateTimePicker
                testID='dateTimePicker'
                value={date2}
                mode={'time'}
                is24Hour={false}
                display='default'
                onChange={onChange2}
                />)}
        </Modal>
    );
}


const styles = StyleSheet.create({
    totalHoursText: {
        marginLeft: 20,
        fontFamily: 'mp-bold',
        fontSize: 40,
        color: colors.lightModeText,
    },
    totalHours: {
        marginTop: 40,
        marginLeft: -7,
        height: 60,
        alignItems: 'center',
        flexDirection: 'row',
    },
    addModalTotalHoursIcons: {
        marginTop: 10,
        width: 40,
        height: 40,
    },
    addModalDateText: {
        fontSize: 25,
        color: colors.lightModeText,
        //marginBottom: 5,
        fontFamily: 'mp-bold',

    },
    addModalText: {
        fontSize: 40,
        color: colors.lightModeText,
        //marginBottom: 5,
        fontFamily: 'mp-bold',
    },
    addModalEntryList: {
        marginTop: 15,
        flexDirection: 'row',
        width: width - 40 - 70,
        height: 40,
        // backgroundColor: '#333'
    },
    addModalDateEntry: {
        width: width - 40 - 70 - 45,
        height: 40,
        backgroundColor: colors.lightModeBackground,
        borderRadius: 10,
        borderColor: colors.lightModeText,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addModalIcons: {
        marginTop: 5,
        width: 30,
        height: 30,
        marginRight: 15,
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
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });


export default Add;