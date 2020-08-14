import React, { FC, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState
} from 'recoil';

type Data = {
  id: number,
  name: string,
};

const dataList: Data[]  = [
  { id: 1, name: 'Data1' },
  { id: 2, name: 'Data2' },
  { id: 3, name: 'Data3' },
  { id: 4, name: 'Data4' },
  { id: 5, name: 'Data5' },
];

const getData = (id: number | null) => {
  return new Promise<Data | null>((resolve, reject) => {
    setTimeout(() => {
      if (id === null) {
        resolve(null);
      }
      const data = dataList.find(data => data.id === id);
      if (data) {
        resolve(data);
      }
      else {
        reject('Not Found');
      }
    }, 2000);
  }); 
};

const idState = atom<number | null>({
  key: 'idState',
  default: null,
});

const searchedDataState = selector<Data | null>({
  key: 'searchedDataState',
  get: async ({get}) => {
    const id = get(idState);
    return await getData(id);
  }
});

export const AsyncTest: FC = () => {
  const [input, setInput] = useState('');
  const [id, setId] = useRecoilState(idState);
  const data = useRecoilValue(searchedDataState);
  const list = data ? [data] : dataList;

  const search = () => {
    const id = Number(input);
    setId(isNaN(id) ? null : id);
  }

  return (
    <View style={{flex: 1, padding: 10}}>
      <TextInput style={{ backgroundColor: '#EEE', padding: 10 }} onChangeText={v => setInput(v)} />
      <Button title="search" onPress={search} />
      {list.map(item => (
        <View>
          <Text>{`${item.id} - ${item.name}`}</Text>
        </View>
      ))}
    </View>
  );
};

export type ErrorBoundaryProps = {};
export type ErrorBoundaryState = {hasError: boolean};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  // @ts-ignore
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if(this.state.hasError) {
      return <View><Text>ERROR</Text></View>;
    }

    return this.props.children;
  }
}