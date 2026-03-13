import { useState } from "react";

export const HelloWorld = () => {
  const [value, setValue] = useState("Hello World!");

  return <button onClick={() => setValue("wodkwokdwokwdok")}>{value}</button>;
};
