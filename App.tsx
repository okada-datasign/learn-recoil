import { StatusBar } from 'expo-status-bar';
import React, { FC } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

const textState = atom({
  key: 'textState',
  default: '',
});

const textCountState = selector({
  key: 'textCountState',
  get: ({get}) => {
    const text = get(textState);
    return text.length;
  },
});

export default function App() {
  return (
    <RecoilRoot>
      <View style={styles.container}>
        <SafeAreaView>
          <Text style={styles.title}>Demo</Text>
          <Input />
          <Echo />
          <TextCounter />
          <StatusBar style="auto" />
        </SafeAreaView>
      </View>
    </RecoilRoot>
  );
};

const Input: FC = (props) => {
  const [text, setText] = useRecoilState(textState);

  const onChange = (value: string) => {
    setText(value);
  };

  return (
    <TextInput style={styles.textInput} value={text} onChangeText={onChange} />
  );
};

const TextCounter: FC = (props) => {
  const count = useRecoilValue(textCountState);
  return (
    <Text>Charactors: {count}</Text>
  );
};

const Echo: FC = (props) => {
  const text = useRecoilValue(textState);
  return (
    <Text>Echo: {text}</Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {

  },
  textInput: {
    width: 200,
    padding: 8,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    fontSize: 16,
  }
});
