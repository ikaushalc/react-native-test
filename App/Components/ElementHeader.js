import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  Card,
  CardItem,
  ListItem,
  Textarea,
  Button,
  Body,
  Right,
  Left,
  Text
} from "native-base";
import DatePickerModal from "./DatePickerModal";
import moment from 'moment';

const ElementHeader = props => {
  const { editItem, onEdit, onAdd, onCancel } = props;
  const [title, setTitle] = useState(editItem != null ? editItem.title : "");
  const [dueDate, setDueDate] = useState(editItem != null ? editItem.date : moment().format("L"))
  return (
    <Card>
      <DatePickerModal
        placeholder="Due date"
        selectedDate={dueDate}
        setSelectedDate={date => setDueDate(moment(date).format("L"))}
      />
      <ListItem noBorder>
        <Body>
          <Textarea
            rowSpan={3}
            bordered
            placeholder="Enter text here..."
            value={title}
            onChangeText={text => setTitle(text)}
          />
        </Body>
      </ListItem>
      <CardItem>
        <Body />
        <Right style={styles.right}>
          <Button
            disabled={title.length == 0}
            style={styles.saveBtn}
            small
            onPress={() => {
              editItem
                ? onEdit({ index: editItem.index, title: title, date: dueDate })
                : onAdd({ index: props.index, title: title , date: dueDate});
            }}
          >
            <Text>{editItem ? "Edit" : "Add"}</Text>
          </Button>
          <Button small style={styles.colorBtn} bordered onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Button>
        </Right>
      </CardItem>
    </Card>
  );
};

export default ElementHeader;

const styles = StyleSheet.create({
  saveBtn: {
    marginRight: 10
  },
  right: {
    flexDirection: "row",
    marginRight: 15
  },
  colorBtn: {
    borderColor: "#C0392B"
  },
  cancelText: {
    color: "#C0392B"
  }
});
