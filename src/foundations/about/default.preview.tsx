import { useState } from "react";

const HelloWorld = () => {
  const [value, setValue] = useState("Hello World!");

  return <button onClick={() => setValue("wodkwokdwokwdok")}>{value}</button>;
};

export default HelloWorld;
