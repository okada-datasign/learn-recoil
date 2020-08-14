import { StatusBar } from 'expo-status-bar';
import React, { FC, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { AsyncTest, ErrorBoundary } from './AyncTest';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
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

type Filter = 'all' | 'completed' | 'uncompleted';

const defaultTodoList: Todo[] = [
  { id: getId(), text: 'Todo 1', isComplete: true },
  { id: getId(), text: 'Todo 2', isComplete: false },
  { id: getId(), text: 'Todo 3', isComplete: true },
  { id: getId(), text: 'Todo 4', isComplete: false },
  { id: getId(), text: 'Todo 5', isComplete: true },
  { id: getId(), text: 'Todo 6', isComplete: false },
  { id: getId(), text: 'Todo 7', isComplete: true },
  { id: getId(), text: 'Todo 8', isComplete: false },
  { id: getId(), text: 'Todo 9', isComplete: true },
  { id: getId(), text: 'Todo 10', isComplete: false },
];

const todoListState = atom<Todo[]>({
  key: 'todoListState',
  default: defaultTodoList,
});

const todoListFilterState = atom<Filter>({
  key: 'todoListFilterState',
  default: 'all',
});

const filteredTodoListState = selector({
  key: 'filteredTodoListState',
  get: ({get}) => {
    const filter = get(todoListFilterState);
    const list = get(todoListState);

    switch(filter) {
      case 'completed':
        return list.filter((item) => item.isComplete);
      case 'uncompleted':
        return list.filter((item) => !item.isComplete);
      default:
        return list;
    }
  }
});

const todoListStatsState = selector({
  key: 'todoListStatsState',
  get: ({get}) => {
    const todoList = get(todoListState);
    const totalNum = todoList.length;
    const totalCompletedNum = todoList.filter((item) => item.isComplete).length;
    const totalCUncompletedNum = todoList.filter((item) => !item.isComplete).length;
    const percentCompleted = totalNum === 0 ? totalNum : totalCompletedNum / totalNum;

    return {
      totalNum,
      totalCompletedNum,
      totalCUncompletedNum,
      percentCompleted,
    }
  },
});

const TodoListFilters: FC = (props) => {
  const [filter, setFilter] = useRecoilState(todoListFilterState);

  const updateFilter = (filter: Filter) => {
    setFilter(filter);
  };

  const styles = TodoListFiltersStyles;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => updateFilter('all')} style={styles.button}>
        {filter === 'all' && <MaterialIcons name="check" style={styles.icon} />}
        <Text style={styles.text}>All</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => updateFilter('completed')} style={styles.button}>
        {filter === 'completed' && <MaterialIcons name="check" style={styles.icon} />}
        <Text style={styles.text}>Completed</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => updateFilter('uncompleted')} style={styles.button}>
        {filter === 'uncompleted' && <MaterialIcons name="check" style={styles.icon} />}
        <Text style={styles.text}>Uncompleted</Text>
      </TouchableOpacity>
    </View>
  )
};

const TodoListStats: FC = (props) => {
  const {
    totalNum,
    totalCompletedNum,
    totalCUncompletedNum,
    percentCompleted,
  } = useRecoilValue(todoListStatsState);

  const formattedPercentCompleted = Math.round(percentCompleted * 100);

  return (
    <View style={{padding: 8}}>
      <View>
        <Text>Total items: {totalNum}</Text>
      </View>
      <View>
        <Text>Items completed: {totalCompletedNum}</Text>
      </View>
      <View>
        <Text>Items not completed: {totalCUncompletedNum}</Text>
      </View>
      <View>
        <Text>Percent completed: {formattedPercentCompleted}%</Text>
      </View>
    </View>
  )
}

const TodoList: FC = (props) => {
  const todoList = useRecoilValue(filteredTodoListState);
  return (
    <>
      <TodoItemCreator />
      <TodoListFilters />
      <ScrollView style={{flex: 1}}>
      {todoList.map(todoItem => 
        <TodoItem key={todoItem.id} item={todoItem} />
      )}
      </ScrollView>
      <TodoListStats />
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

  const styles = TodoItemCreatorStyles;
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

  const styles = TodoItemStyles;
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
    },
  });

  return (
    <RecoilRoot>
      <SafeAreaView style={styles.container}>
        {/* <TodoList />
        <StatusBar style="auto" /> */}
        <ErrorBoundary>
          <React.Suspense fallback={<View><Text>Loading...</Text></View>}>
            <AsyncTest />
          </React.Suspense>
        </ErrorBoundary>
      </SafeAreaView>
    </RecoilRoot>
  );
};


const TodoItemStyles = StyleSheet.create({
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

const TodoItemCreatorStyles = StyleSheet.create({
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

const TodoListFiltersStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    padding: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#3578e5',
    borderRadius: 8,
  },
  icon: {
    color: '#00C851',
    fontSize: 16,
  },
  text: {
    color: '#222222',
    fontSize: 16,
  }
});