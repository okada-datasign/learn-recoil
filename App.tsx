import { StatusBar } from 'expo-status-bar';
import React, { FC, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState
} from 'recoil';

// utility for creating unique Id
let id = 0;
function getId() {
  return id++;
}

function replaceItemAtIndex<T>(arr: T[], index: number, newValue: T): T[] {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex<T>(arr: T[], index: number): T[] {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

type Todo = {
  id: number;
  text: string,
  isComplete: boolean,
};

const defaultTodoList: Todo[] = [
  { id: getId(), text: 'Todo 1', isComplete: true },
  { id: getId(), text: 'Todo 2', isComplete: false },
]

const todoListState = atom<Todo[]>({
  key: 'todoListState',
  default: [],
});

const TodoList: FC = (props) => {
  const todoList = useRecoilValue(todoListState);
  return (
    <>
      {/* <TodoListStats /> */}
      {/* <TodoListFilters /> */}
      <TodoItemCreator />
      {todoList.map(todoItem => 
        <TodoItem key={todoItem.id} item={todoItem} />
      )}
    </>
  );
};

const TodoItemCreator: FC = (props) => {
  const [inputValue, setInputValue] = useState('');
  const setTodoList = useSetRecoilState(todoListState);

  const addItem = () => {
    const newTodo: Todo = { id: getId(), text: inputValue, isComplete: false };
    setTodoList(prevTodoList => [...prevTodoList, newTodo]);
    setInputValue('');
  };

  const onChange = (text: string) => {
    setInputValue(text);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: '#75a6ff',
      padding: 16,
    },
    inputContainer: {
      flex: 1,
      backgroundColor: '#F8F8F8',
      borderRadius: 8,
      padding: 8,
    },
    buttonContainer: {
      marginLeft: 16,
      backgroundColor: '#3578e5',
      borderRadius: 8,
      padding: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput value={inputValue} onChangeText={onChange} />
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={addItem}>
        <Text>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const TodoItem: FC<{item: Todo}> = ({item}) => {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item);

  const editItemText = (text: string) => {
    const newItem = {...item, text: text }
    const newList = replaceItemAtIndex<Todo>(todoList, index, newItem);
    setTodoList(newList);
  };

  const toggleItemCompletion = () => {
    const newItem = {...item, isComplete: !item.isComplete }
    const newList = replaceItemAtIndex<Todo>(todoList, index, newItem);
    setTodoList(newList);
  };

  const deleteItem = () => {
    const newList = removeItemAtIndex<Todo>(todoList, index);
    setTodoList(newList);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 16,
      borderBottomColor: '#DDD',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    inputContainer: {
      flex: 1,
      backgroundColor: '#F8F8F8',
      borderRadius: 8,
      padding: 8,
    },
    buttonContainer: {
      marginLeft: 16,
      backgroundColor: '#3578e5',
      borderRadius: 8,
      padding: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput value={item.text} onChangeText={editItemText} />
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={toggleItemCompletion}>
        <Text>{item.isComplete ? 'Done' : 'Doing'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={deleteItem}>
        <Text>delete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
  });

  return (
    <RecoilRoot>
      <SafeAreaView style={styles.container}>
        <TodoList />
        <StatusBar style="auto" />
      </SafeAreaView>
    </RecoilRoot>
  );
};
