import React, {Component} from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TouchableHighlight,
  Platform,
  Image,
  StyleSheet,
} from 'react-native';
import {ListItem, Body, Right, Left} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

class DatePickerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      date: new Date(),
      selectedDate: null,
      selectedTime: null,
      pickerMode: 'date',
    };
  }
  componentDidMount(){
    const {selectedDate} = this.props;
    this.setState({selectedDate: selectedDate})
  }
  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      modalVisible: Platform.OS === 'ios' ? true : false,
      date,
      selectedDate: date
    //  selectedDate: Platform.OS === 'ios' ? undefined : date,
    });
    if (Platform.OS !== 'ios') {
      this.combineDateTime();
    }
  };

  setTime = (event, date) => {
    date = date || this.state.date;
    this.setState({
      modalVisible: Platform.OS === 'ios' ? true : false,
      date,
      selectedTime: date,
     // selectedTime: Platform.OS === 'ios' ? undefined : date,
    });
    if (Platform.OS !== 'ios') {
      this.combineDateTime();
    }
  };

  combineDateTime = () => {
    const {selectedDate, selectedTime} = this.state;
    var date = selectedDate;
    if (selectedTime) {
      date = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        selectedTime.getSeconds(),
      );
    }
    this.setState({selectedTime: date});
    this.props.setSelectedDate(date);
  };

  saveDate = () => {
    const {selectedDate, selectedTime} = this.state;
    var date = selectedDate ? selectedDate : this.state.date;
    if (selectedTime) {
      date = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        selectedTime.getSeconds(),
      );
    }
    this.setState({
      selectedDate: date,
      selectedTime: date,
      modalVisible: false,
    });
    this.props.setSelectedDate(date);
  };

  render() {
    const {
      modalVisible,
      date,
      selectedDate,
      pickerMode,
      selectedTime,
    } = this.state;
    const {placeholder, minimumDate} = this.props;

    if (Platform.OS === 'ios') {
      return (
        <View style={styles.container}>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() =>
                this.setState({modalVisible: true, pickerMode: 'date'})
              }>
              <Text style={styles.placeholder}>
                  {placeholder}
              </Text>
              <Text style={styles.textStyle}>
                {selectedDate != null
                  ? moment(selectedDate).format('LL')
                  : ""}
              </Text>
            </TouchableOpacity>
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <TouchableHighlight
              style={styles.backgroundContainer}
              onPress={() => this.setState({modalVisible: false})}>
              <View style={styles.pickerContainer}>
                <ListItem>
                  <Left>
                    <TouchableOpacity
                      onPress={() => this.setState({modalVisible: false})}>
                      <Text style={styles.buttonTextStyle}>Cancel</Text>
                    </TouchableOpacity>
                  </Left>

                  <Right>
                    <TouchableOpacity onPress={() => this.saveDate()}>
                      <Text style={styles.buttonTextStyle}>Done</Text>
                    </TouchableOpacity>
                  </Right>
                </ListItem>
                <DateTimePicker
                  minimumDate={minimumDate}
                  value={date}
                  mode={pickerMode}
                  onChange={pickerMode === 'date' ? this.setDate : this.setTime}
                />
              </View>
            </TouchableHighlight>
          </Modal>
        </View>
      );
    } else {
      return (
        <View>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() =>
                this.setState({modalVisible: true, pickerMode: 'date'})
              }>
              <Text style={styles.placeholder}>
                  {placeholder}
              </Text>
              <Text style={styles.textStyle}>
                {selectedDate != null
                  ? moment(selectedDate).format('L')
                  : ""}
              </Text>
            </TouchableOpacity>
          </View>
          {modalVisible && (
            <DateTimePicker
              minimumDate={minimumDate}
              value={date}
              mode={pickerMode}
              onChange={pickerMode === 'date' ? this.setDate : this.setTime}
            />
          )}
        </View>
      );
    }
  }
}

DatePickerModal.defaultProps = {};

export default DatePickerModal;

const styles = StyleSheet.create({

    container: {
        flex: 1,
      },
      datePickerContainer: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: 10,
        marginHorizontal: 20
      },
      textStyle: {
        color: 'black',
      },
      backgroundContainer: {
        flex: 1,
        backgroundColor: '#0000004C',
        justifyContent: 'flex-end',
      },
      pickerContainer: {
        backgroundColor: 'white',
        paddingBottom: 30,
      },
      buttonTextStyle: {
        color: 'blue',
      },
      imageStyle: {
        height: 30,
      },
      placeholder:{
          marginVertical: 10,
          color: 'gray',
          marginHorizontal: 3,
      }
})