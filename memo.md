# Recoil

## Core Concepts

### Atom

-  ステートの単位
-  更新/購読ができる
-  atomが更新されると購読するコンポーネントに反映される
-  コンポーネントのローカルステートの代わりとしても利用される
-  1つのatomを複数コンポーネントから購読してステートを共有
-  ユニークキーを割り当てる必要がある
-  `atom`関数で作成
-  `useRecoilState`で購読


### Selectors

- pure function
- atomや他のselectorを入力とする
- 入力もとのatom、selectorが更新されると再評価される
- atomと同様に購読できる
- `selector`関数で作成
- `useRecoilState`で購読
- `useRecoilValue`でも購読できる(readonly)

## ESLint

もう少し詳しく調べないとわかならい  
そもそも`useReacilCallback` がわからないので

- `eslint-plugin-react-hooks `
  - Add `useRecoilCallback` as additionalHooks


## 2020.07.31

[Selectorのチュートリアル](https://recoiljs.org/docs/basic-tutorial/selectors)

- 別のステートに依存するようなステートの書き方
  - TodoリストとフィルタのステートからフィルタされたTodoリストを派生
  - Todoリストからステータスを算出したステートを派生

```
filteredTodoListState(Selector)
 ┗ todoListState(Atom)
 ┗ todoListFilterState(Atom)

todoListStatsState(Selector)
 ┗ TodoListState(Atom)
```

Reduxだとreducerや個々のconnect、component内でselectorの役割を担う？  
Selectorという単位でロジックがまとまっていてステートをどのように扱いたいかがわかりやすい気がする。


## 2020.08.14

[asynchronous-data-queries](https://recoiljs.org/docs/guides/asynchronous-data-queries)

>Recoil allows you to seamlessly mix synchronous and asynchronous functions in your data-flow graph of selectors.  
>Simply return a Promise to a value instead of the value itself from a selector get callback, the interface remains exactly the same.

- SelectorのgetコールバックでPromiseを返すだけ
- Selectorを利用する側は特に考慮する必要なし
- Promiseが解決されるまでの表示は`React.Suspense`でハンドルできる
- エラーのハンドルは`ErrorBoundary`でハンドル

## 2020.08.21

### [React.Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html)

- React 16.6で追加
- Experimental
- Stableな実装は[ここ](https://www.robinwieruch.de/react-hooks-fetch-data)を参照
  - useEffect内で非同期関数を実行
  - 実行結果をステートに反映
- 宣言的にローディング状態を指定するもの
- fetch等のAPIを置き換えるものではない
- データフェッチングライブラリに統合させることができる
- 非同期処理を同期的に扱っていると感じる
- [Concurrent Mode](https://reactjs.org/docs/concurrent-mode-intro.html)
- [Building Great User Experiences with Concurrent Mode and Suspense](https://reactjs.org/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html)
- [Relay](https://relay.dev/docs/en/experimental/api-reference)
  - FacebookがプロダクションでSuspenseと統合して使用しているライブラリ
  - GraphQL
  - [Practice Guide](https://relay.dev/docs/en/experimental/step-by-step)
