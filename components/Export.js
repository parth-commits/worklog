import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, Dimensions, Modal, Pressable, Button, TouchableOpacity, TouchableWithoutFeedback, Image, Touchable } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import RNPickerSelect from 'react-native-picker-select';
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
const numberMappingTo2Digits = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

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
const Export = (props) => {

    const [selectedMonth, setSelectedMonth] = useState(Object.keys(props.workLogObj).sort(function(a, b){return b-a})[0]);
    const [wordedMonth, setWordedMonth] = useState(monthNumberMapping[Object.keys(props.workLogObj).sort(function(a, b){return b-a})[0].slice(4,6)] + ', ' + Object.keys(props.workLogObj).sort(function(a, b){return b-a})[0].slice(0,4));

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const [date, setDate] = useState(new Date());
    const [date2, setDate2] = useState(new Date());
    const [mode, setMode] = useState('date');
    
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    }
    const showMode2 = (currentMode) => {
        setShow2(true);
        setMode(currentMode);
    }

    const onChangeMonthFunc = (newMonth) => {
        setSelectedMonth(newMonth);
        setWordedMonth(monthNumberMapping[newMonth.slice(4,6)] + ', ' + newMonth.slice(0,4));
    }
    /* Sets the starting time and its states */
    const onChange = (event, selectedDate) => {
        console.log(selectedDate);
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    }

    /* Sets the ending time */
    const onChange2 = (event, selectedDate) => {
        console.log(selectedDate);
        const currentDate = selectedDate || date2;
        setShow2(Platform.OS === 'ios');
        setDate2(currentDate);

    }
    /*const getPickerObject = () => {
        let monthKeys = Object.keys(props.workLogObj).sort(function(a, b){return b-a});
        let objList = [];
        monthKeys.forEach(month => {
            let l = monthNumberMapping[month.slice(4,6)] + ', ' + month.slice(0,4);
            let v = month;
            let pushObj = {
                label: l,
                value: v,
            };
            objList.push(pushObj);
        });
        return objList;
    }*/

    const exportFunc = async (workobj) => {
        // console.log(workobj);
        // console.log(month);
        let data = makeSmallerObj(workobj);
        if (data === false) {
            return;
        }
        let ws = XLSX.utils.json_to_sheet(data);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Work Log Data");
        const wbout = XLSX.write(wb, {
        type: 'base64',
        bookType: "xlsx"
        });
        const uri = FileSystem.cacheDirectory + `${date.toDateString()} to ${date2.toDateString()}.xlsx`;
        // console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
        await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64
        });

        await Sharing.shareAsync(uri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Work Log Data',
        UTI: 'com.microsoft.excel.xlsx'
        });
        props.setExportModalVisible(!props.exportModalVisible);
    }

    const makeSmallerObj = (workobj) => {
        // if date is after date2 (ie -time), dont do anything and return
        if (date >= date2) {
            props.setExportModalVisible(!props.exportModalVisible);
            return false;
        }
        const startDay = numberMappingTo2Digits[date.getDate()];
        const startYearMonth = date.getFullYear().toString() + (date.getMonth() + 1).toString();
        //const startYear = date.getFullYear();
        const endDay = numberMappingTo2Digits[date2.getDate()];
        const endYearMonth =  date2.getFullYear().toString() + (date2.getMonth() + 1).toString();
        console.log(startDay);
        console.log(startYearMonth);
        console.log(endDay);
        console.log(endYearMonth);

        let monthKeys = Object.keys(props.workLogObj).sort(function(a, b){return b-a});

        let returnObj = [];
        let totalHours = 0;
        //let temp = workobj[month][0];
        monthKeys.forEach(monthKey => {
            let dateKeys = Object.keys(workobj[monthKey][0]).sort(function(a, b){return b-a});
            let monthObj = props.workLogObj[monthKey][0];
            // if same month-year, then we have to check dates differently
            if (monthKey === startYearMonth && monthKey === endYearMonth) {
                dateKeys.forEach(day => {
                    if (day <= endDay && day >= startDay) {
                        // add it
                        let startHour = monthObj[day][1].slice(0,2);
                        let startMin = monthObj[day][1].slice(2,4);
                        let endHour = monthObj[day][2].slice(0,2);
                        let endMin = monthObj[day][2].slice(2,4);
                        let temp2 = {
                            "date": monthKey.slice(0,4) + '/' + monthKey.slice(4,6) + '/' + day,
                            "day": monthObj[day][0],
                            "start": hourNumberMapping[startHour] + ':' + startMin + hourAMPMMapping[startHour],
                            "end": hourNumberMapping[endHour] + ':' + endMin + hourAMPMMapping[endHour],
                            "total": monthObj[day][3],
                        };
                        totalHours += monthObj[day][3];
                        returnObj.push(temp2);
                    }
                });
            } else if (monthKey == endYearMonth) { // its end month
                dateKeys.forEach(day => {
                    if (day <= endDay) {
                        // add it
                        let startHour = monthObj[day][1].slice(0,2);
                        let startMin = monthObj[day][1].slice(2,4);
                        let endHour = monthObj[day][2].slice(0,2);
                        let endMin = monthObj[day][2].slice(2,4);
                        let temp2 = {
                            "date": monthKey.slice(0,4) + '/' + monthKey.slice(4,6) + '/' + day,
                            "day": monthObj[day][0],
                            "start": hourNumberMapping[startHour] + ':' + startMin + hourAMPMMapping[startHour],
                            "end": hourNumberMapping[endHour] + ':' + endMin + hourAMPMMapping[endHour],
                            "total": monthObj[day][3],
                        };
                        totalHours += monthObj[day][3];
                        returnObj.push(temp2);
                    }
                });
            } else if (monthKey == startYearMonth) { // its start month
                dateKeys.forEach(day => {
                    if (day >= startDay) {
                        // add it
                        let startHour = monthObj[day][1].slice(0,2);
                        let startMin = monthObj[day][1].slice(2,4);
                        let endHour = monthObj[day][2].slice(0,2);
                        let endMin = monthObj[day][2].slice(2,4);
                        let temp2 = {
                            "date": monthKey.slice(0,4) + '/' + monthKey.slice(4,6) + '/' + day,
                            "day": monthObj[day][0],
                            "start": hourNumberMapping[startHour] + ':' + startMin + hourAMPMMapping[startHour],
                            "end": hourNumberMapping[endHour] + ':' + endMin + hourAMPMMapping[endHour],
                            "total": monthObj[day][3],
                        };
                        totalHours += monthObj[day][3];
                        returnObj.push(temp2);
                    }
                });
            } else if (monthKey > startYearMonth && monthKey < endYearMonth) { // its inbetween
                dateKeys.forEach(day => {
                    // add all days
                    let startHour = monthObj[day][1].slice(0,2);
                    let startMin = monthObj[day][1].slice(2,4);
                    let endHour = monthObj[day][2].slice(0,2);
                    let endMin = monthObj[day][2].slice(2,4);
                    let temp2 = {
                        "date": monthKey.slice(0,4) + '/' + monthKey.slice(4,6) + '/' + day,
                        "day": monthObj[day][0],
                        "start": hourNumberMapping[startHour] + ':' + startMin + hourAMPMMapping[startHour],
                        "end": hourNumberMapping[endHour] + ':' + endMin + hourAMPMMapping[endHour],
                        "total": monthObj[day][3],
                    };
                    totalHours += monthObj[day][3];
                    returnObj.push(temp2);
                });
            }
        });
        
        let finalCol = {
            "date": 'Total hours',
            "day": '',
            "start": '',
            "end": '',
            "total": totalHours,
        }
        returnObj.push(finalCol);
        return returnObj;
    }

    return (
        <Modal
          animationType="fade"
          transparent={true}
          visible={props.exportModalVisible}
          onRequestClose={() => {
            props.setExportModalVisible(!props.exportModalVisible);
          }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.infoModalTitle}>Export</Text>
                    <View style={styles.scrollV}>
                        <ScrollView>
                            <View style={styles.infoModalItem}>
                                
                                <Text style={styles.infoModalItemText}>Select start date and end date then press Export button to export to an Excel file.</Text>
                            </View>
                            
                            <Text style={styles.addModalText}>Start</Text>
                            <View style={styles.addModalEntryList}>
                                <Image style={styles.addModalIcons} source={require('../assets/images/DateIcon.png')}></Image>
                                <TouchableOpacity style={styles.addModalDateEntry} onPress={() => showMode('date')}>
                                    <Text style={styles.addModalDateText}>{date.toDateString()}</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <Text style={styles.addModalText}>Finish</Text>
                            <View style={styles.addModalEntryList}>
                                <Image style={styles.addModalIcons} source={require('../assets/images/DateIcon.png')}></Image>
                                <TouchableOpacity style={styles.addModalDateEntry} onPress={() => showMode2('date')}>
                                    <Text style={styles.addModalDateText}>{date2.toDateString()}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                    
                    
                    <View style={styles.bottomList}>
                        <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => props.setExportModalVisible(!props.exportModalVisible)}
                        >
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>
                        <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => exportFunc(props.workLogObj)}
                        >
                            <Text style={styles.textStyle}>Export</Text>
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
                mode={mode}
                is24Hour={false}
                display='default'
                onChange={onChange2}
                />)}
        </Modal>
    );
}
// show2 == start (onchange2)
// show1 == finish (onchange)

const styles = StyleSheet.create({
    
    addModalText: {
        fontSize: 25,
        color: colors.lightModeText,
        //marginBottom: 5,
        fontFamily: 'mp-bold',
    },
    addModalDateText: {
        fontSize: 25,
        color: colors.lightModeText,
        //marginBottom: 5,
        fontFamily: 'mp-bold',

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
    addModalEntryList: {
        marginTop: 15,
        flexDirection: 'row',
        width: width - 40 - 70,
        height: 40,
        // backgroundColor: '#333'
    },
    selectMonth: {
        marginTop: 20,
        width: width - 40- 70,
        height: 50,
        borderWidth: 4,
        borderColor: colors.lightModeText,
        borderRadius: 15,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    selectedMonthText: {
        color: colors.lightModeText,
        fontSize: 30,
        fontFamily: 'mp-medium',
    },
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
        fontSize: 20,
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


export default Export;