import * as React from "react";
import { Input, InputProps, Space } from "antd";
const { Search } = Input;

export default function InputSearch(props: InputProps) {
  const { ...restProps } = props;
  return (
    <>
      <Search
        placeholder="input search text"
        enterButton 
        size="middle"
        {...restProps}
      />
    </>
  );
}
