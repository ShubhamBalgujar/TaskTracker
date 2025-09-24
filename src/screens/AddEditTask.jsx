import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TextInput, HelperText, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import {
  addTask,
  updateTask,
  removeTask,
  loadTasks,
} from '../utils/redux/taskSlice';
import { simulateNotification } from '../notifications/notifications';

const AddEditTask = props => {
  const { taskId } = props.route.params;
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const isEdit = typeof taskId === 'number';

  const task = useSelector(s =>
    isEdit ? s.task.tasks.find(t => t.id === taskId) : undefined,
  );

  useEffect(() => {
    if (task) {
      setTitle(task.title);
    }
  }, [task]);

  const validateTitle = text => {
    const isValid = text.trim().length > 0;
    setError(!isValid);
    return isValid;
  };

  const handleSave = () => {
    if (!validateTitle(title)) return;
    try {
      if (isEdit) {
        dispatch(updateTask({ id: taskId, title }));
        simulateNotification(`Task Updated : ✅ ${title}`);
      } else {
        dispatch(addTask(title));
        simulateNotification(`Task Added : ✅ ${title}`);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to save task');
    }
  };

  const onDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              dispatch(removeTask(taskId));
              simulateNotification(`Task Deleted : ❌ ${title}`);
              navigation.goBack();
            } catch (e) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={text => setTitle(text)}
        onBlur={() => validateTitle(title)}
        error={error}
        mode="outlined"
        style={styles.input}
      />
      <HelperText type="error" visible={error}>
        valid string required
      </HelperText>
      <View style={[styles.buttonContainer, !isEdit && styles.centerButton]}>
        <Button
          mode="contained"
          onPress={() => {
            handleSave();
          }}
          //disabled={error || title.trim().length === 0}
          style={styles.button}
        >
          {isEdit ? 'Update Task' : 'Add Task'}
        </Button>
        {isEdit && (
          <Button
            mode="contained"
            onPress={() => {
              onDelete();
            }}
            //disabled={error || title.trim().length === 0}
            style={styles.button}
          >
            {'Delete'}
          </Button>
        )}
      </View>
    </View>
  );
};

export default AddEditTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centerButton: {
    justifyContent: 'center',
  },
});
