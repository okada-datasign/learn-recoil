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