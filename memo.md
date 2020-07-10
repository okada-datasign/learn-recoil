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
