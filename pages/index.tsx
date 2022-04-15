import type { NextPage } from "next";
import Resizer from "./lib/components/Resizer";

const Home: NextPage = () => {
  return (
    <>
      <Resizer draggable={true} className="myElement">
        <span>Resize me</span>
      </Resizer>
    </>
  );
};

export default Home;
