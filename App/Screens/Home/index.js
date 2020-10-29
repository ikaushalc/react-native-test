import React, { useState, useEffect, useMemo, useRef } from "react";
import { FlatList, View, Share } from "react-native";
import { Container, Content, Text, Fab, Icon } from "native-base";
import ElementHeader from "../../Components/ElementHeader";
import ElementCard from "../../Components/ElementCard";
import { ButtonGroup, SearchBar } from "react-native-elements";
import styles from "./styles";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [arrayholder, setArrayholder] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState();
  const [sortByIndex, setSortByIndex] = useState(0);
  const [search, setSearch] = useState("");
  const buttons = ["Date", "Title"];

  useEffect(() => {
    getData();
  }, []);

  //Storing Date

  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@todo", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@todo");
      if (value !== null) {
        setData(JSON.parse(value));
        setArrayholder(JSON.parse(value));
      }
    } catch (e) {
      // error reading value
    }
  };

  const onSelect = useRef(id => {
    setData(oldData => {
      return [
        ...oldData.map(item => {
          if (id === item.index) {
            return {
              ...item,
              selected: !item.selected
            };
          }
          return item;
        })
      ];
    });
  });

  const onDelete = useRef(index => {
    var newData = [];
    setData(oldData => {
      newData = oldData.filter((item, ind) => item.index !== index)
      return newData;
    });
    setArrayholder(oldData => {
      return newData;
    });
    storeData(newData);
  });

  const onEdit = useRef(item => {
    setEditItem(item);
    setShowAdd(true);
  });

  const onShare = useRef( async (item) => {
    try {
      const result = await Share.share({
        message: item.title,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  });

  const handleSearch = text => {
    const formattedQuery = text.toLowerCase();
    const newData = arrayholder.filter(aitem => {
      if (aitem.title.toLowerCase().match(formattedQuery)) {
        return aitem;
      }
    });
    setSearch(formattedQuery);
    setData(newData);
  };

  const renderHeader = () => {
    if (showAdd) {
      return (
        <ElementHeader
          index={new Date().getUTCMilliseconds()}
          editItem={editItem}
          onEdit={newItem => {
            var foundIndex = data.findIndex(x => x.index == newItem.index);
            var editedData = data;
            editedData[foundIndex] = newItem;
            setData(editedData);
            storeData(editedData);
            setArrayholder(editedData);
            setEditItem(null);
            setShowAdd(false);
          }}
          onAdd={newItem => {
            setData([...data, newItem]);
            storeData([...data, newItem]);
            setArrayholder([...data, newItem]);
          }}
          onCancel={() => {
            setShowAdd(false);
            setEditItem(null);
          }}
        />
      );
    }
    return null;
  };

  const renderEmptyList = () => {
    return (
      <View style={styles.container}>
        <Text>Add to do's and get started!</Text>
      </View>
    );
  };
  var sortedData = sortByIndex == 0  ?  data.sort((a, b) => {
    return moment(b.date).diff(moment(a.date));
  }) : data.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <Container>
      {!showAdd && (
        <>
          <SearchBar
            containerStyle={styles.searchContainer}
            inputContainerStyle={{ backgroundColor: "#F1F1F1" }}
            placeholder="Search..."
            onChangeText={text => handleSearch(text)}
            value={search}
          />
          <ButtonGroup
            onPress={index => setSortByIndex(index)}
            selectedIndex={sortByIndex}
            buttons={buttons}
            containerStyle={{ height: 30 }}
          />
        </>
      )}
      <FlatList
        contentContainerStyle={styles.flatList}
        data={sortedData}
        renderItem={({ item }) => (
          <ItemPureFunctional
            item={item}
            onSelect={onSelect.current}
            onDelete={onDelete.current}
            onEdit={onEdit.current}
            onShare={onShare.current}
          />
        )}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item, index) => `${index}`}
        ListEmptyComponent={renderEmptyList}
      />
      <Fab
        active={true}
        direction="up"
        style={styles.fab}
        position="bottomRight"
        onPress={() => {
          setEditItem(null);
          setShowAdd(!showAdd);
        }}
      >
        <Icon name={!showAdd ? "add" : "close"} />
      </Fab>
    </Container>
  );
};
export default Home;

function ItemPureFunctional({
  item: { index, title, date, selected },
  onSelect,
  onDelete,
  onEdit,
  onShare
}) {
  return useMemo(() => {
    return (
      <ElementCard
        selected={selected}
        squareText={index}
        title={title}
        subTitle={date}
        onShare={() => onShare({ index, title, date, selected })}
        onPress={() => onSelect(index)}
        onDelete={() => onDelete(index)}
        onEdit={() => onEdit({ index, title, date, selected })}
      />
    );
  }, [index, title, date, selected, onSelect, onDelete, onEdit,onShare]);
}
