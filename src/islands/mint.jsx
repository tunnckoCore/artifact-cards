// import * as React from "react";
import WagmiWrapper from "./wagmi";
import Connect from "./connect";

export default ({ info }) => {
  return (
    <WagmiWrapper>
      <Connect client:load info={info} />
    </WagmiWrapper>
  );
};
