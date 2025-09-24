import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Card, FAB, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { loadTasks } from '../utils/redux/taskSlice';

import navigationConstants from '../navigation/RouteConstants';

const TaskList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { tasks, loading } = useSelector(state => state.task);
  const [searchText, setSearchText] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch]);

  useEffect(() => {
    if (searchText.trim().length > 0) {
      const result = tasks.filter(t =>
        t.title.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredTasks(result);
    } else {
      setFilteredTasks(tasks);
    }
  }, [searchText, tasks]);

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <TextInput
            label="Search"
            value={searchText}
            onChangeText={text => setSearchText(text)}
            mode="outlined"
            style={styles.input}
          />
          <FlatList
            data={filteredTasks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Card
                key={item.id}
                style={styles.itemCard}
                onPress={() =>
                  navigation.navigate(navigationConstants.ADD_EDIT_TASK, {
                    taskId: item.id,
                  })
                }
              >
                <Card.Title
                  title={item.title}
                  titleStyle={{ fontWeight: 'bold', color: 'black' }}
                  subtitle={`Updated on: ${formatDate(item.updatedDate)}`}
                  subtitleStyle={{ color: 'gray' }}
                />
              </Card>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No tasks available</Text>
            )}
          />
          <FAB
            icon="plus"
            style={styles.fab}
            mode="elevated"
            onPress={() =>
              navigation.navigate(navigationConstants.ADD_EDIT_TASK, {
                taskId: null,
              })
            }
          />
        </>
      )}
    </View>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  container: {
    flex: 1, // This ensures the View takes full available height
  },
  input: {
    margin: 10,
  },
  itemCard: {
    margin: 10,
    borderRadius: 8,
    elevation: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    justifyContent: 'center',
  },
});
