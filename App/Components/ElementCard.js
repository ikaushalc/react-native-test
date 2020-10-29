import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, ListItem, Body, Right, Left, Text, H3, Icon } from "native-base";
import moment from "moment";

const ElementCard = props => {
  const {
    subTitle,
    title,
    onDelete,
    onEdit,
    onPress,
    onShare,
    selected
  } = props;
  return (
    <Card style={styles.card}>
      <ListItem icon noBorder onPress={onPress}>
        <Left>
          <View style={styles.square}>
            {selected && (
              <Icon name="check" type="MaterialIcons" style={styles.edit} />
            )}
          </View>
        </Left>
        <Body>
          <Text textStyle={styles.title}>{title}</Text>
          <Text note>{moment(subTitle).format("LL")}</Text>
        </Body>
        <Right style={styles.right}>
          <Icon
            name="share"
            type="MaterialIcons"
            onPress={onShare}
            style={styles.share}
          />
          <Icon
            name="edit"
            type="MaterialIcons"
            onPress={onEdit}
            style={styles.edit}
          />
          <Icon
            name="clear"
            type="MaterialIcons"
            onPress={onDelete}
            style={styles.delete}
          />
        </Right>
      </ListItem>
    </Card>
  );
};

export default ElementCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    paddingVertical: 10
  },
  square: {
    borderWidth: 1,
    borderColor: 'gray',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: "black"
  },
  subTitle: {
    color: "gray"
  },
  right: {
    flexDirection: "row"
  },
  share:{
    color: "#5067FF"
  },
  edit: {
    color: "#00C060"
  },
  delete: {
    color: "#C0392B"
  }
});
