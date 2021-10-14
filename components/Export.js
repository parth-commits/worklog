import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, Dimensions, Modal, Pressable, Button, TouchableOpacity, TouchableWithoutFeedback, Image, Touchable } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import RNPickerSelect from 'react-native-picker-select';
/* Device dimensions, use to optimize for device of all sizes */
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

/* colors to use */
const colors = {
    lightModeBackground: '#D8F6E0',
    lightModeTile: '#FAFFFA',
    lightModeText: '#4A6050',
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

    const onChangeMonthFunc = (newMonth) => {
        setSelectedMonth(newMonth);
        setWordedMonth(monthNumberMapping[newMonth.slice(4,6)] + ', ' + newMonth.slice(0,4));
    }

    const getPickerObject = () => {
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
    }

    const exportFunc = async (workobj, month) => {
        // console.log(workobj);
        // console.log(month);
        let data = makeSmallerObj(workobj, month);
        let ws = XLSX.utils.json_to_sheet(data);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Work Log Data");
        const wbout = XLSX.write(wb, {
        type: 'base64',
        bookType: "xlsx"
        });
        const uri = FileSystem.cacheDirectory + `${month}.xlsx`;
        // console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
        await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64
        });

        await Sharing.shareAsync(uri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'MyWater data',
        UTI: 'com.microsoft.excel.xlsx'
        });
        props.setExportModalVisible(!props.exportModalVisible);
    }

    const makeSmallerObj = (workobj, month) => {
        let returnObj = [];
        let temp = workobj[month][0];
        let keys = Object.keys(temp).sort(function(a, b){return b-a});
        for (let i = 0; i < keys.length; i++) {
            let startHour = temp[keys[i]][1].slice(0,2);
            let startMin = temp[keys[i]][1].slice(2,4);
            let endHour = temp[keys[i]][2].slice(0,2);
            let endMin = temp[keys[i]][2].slice(2,4);
            let temp2 = {
                "date": month.slice(0,4) + '/' + month.slice(4,6) + '/' + keys[i],
                "day": temp[keys[i]][0],
                "start": hourNumberMapping[startHour] + ':' + startMin + hourAMPMMapping[startHour],
                "end": hourNumberMapping[endHour] + ':' + endMin + hourAMPMMapping[endHour],
                "total": temp[keys[i]][3],
            };
            returnObj.push(temp2);
        }
        let finalCol = {
            "date": 'Total hours',
            "day": '',
            "start": '',
            "end": '',
            "total": workobj[month][1],
        }
        returnObj.push(finalCol);
        return returnObj;
    }
    let months = Object.keys(props.workLogObj).sort(function(a, b){return b-a});
    //let keyys = Object.keys(props.workLogObj[months[0]][0]).sort(function(a, b){return b-a});
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
                                
                                <Text style={styles.infoModalItemText}>Select a Month to export and then press Export button to export to an Excel file.</Text>
                            </View>
                            <View style={styles.selectMonth}>
                                <RNPickerSelect
                                    onValueChange={(value) => onChangeMonthFunc(value)}
                                    items={getPickerObject()}
                                >
                                    <Text style={styles.selectedMonthText}>{wordedMonth}</Text>
                                </RNPickerSelect>
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
                        onPress={() => exportFunc(props.workLogObj, selectedMonth)}
                        >
                            <Text style={styles.textStyle}>Export</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
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