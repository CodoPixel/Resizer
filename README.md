# Resizer

This package is not available in `npm`, but it's easy to add. It's been written in `TSX`.

## How to use?

```tsx
import type { NextPage } from "next";
import Resizer from "./lib/components/Resizer";

const Home: NextPage = () => {
  return (
    <Resizer>
      <span>Resize me</span>
    </Resizer>
  );
};

export default Home;
```

## Customisations

```ts
interface ResizerProps {
  className?: string; // a custom class for your element.
  minWidth?: number; // the minimum width of the box.
  maxWidth?: number; // the maximum width of the box.
  minHeight?: number; // the minimum height of the box.
  maxHeight?: number; // the maximum height of the box.
  right?: boolean; // whether you want it to be resizeable on the right side or not. True by default.
  bottom?: boolean; // whether you want it to be resizeable on the bottom side or not. True by default.
  draggable?: boolean; // whether you want it to be draggable or not.
  children?: React.ReactNode; // the content of your element.
}
```

> NOTE : if your element is draggable, then its content cannot be selected with the cursor.

## License

MIT License.