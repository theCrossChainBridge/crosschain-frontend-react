import React from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { parseEther, parseAbi } from "viem";
import { useState } from "react";

const stake = [
  "function stake(address token_addr, uint256 _amount) external returns (bool success)",
];
const abi = parseAbi(stake);

export function Stake() {
  const [inputAmount, setInputAmount] = useState<number>(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInputAmount(parseInt(event.target.value));
  };

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: "0xd78A2e1ef25f8Bfe4Fd94953d0E5a188a7C0d5bB",
    abi: abi,
    functionName: "stake",
    args: [
      "0x9e772fBAe36A4366bc9A3513f2188510d0e458Ff",
      parseEther(`${inputAmount}`),
    ],
  });

  const { data, write, error, isError } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <form>
      <input type="number" value={inputAmount} onChange={handleInputChange} />
      <button disabled={!write || isLoading} onClick={() => write?.()}>
        {isLoading ? "Staking..." : "Stake"}
      </button>
      {isSuccess && (
        <div>
          Successfully Stake your Token!
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
      {(isPrepareError || isError) && (
        <div>Error: {(prepareError || error)?.message}</div>
      )}
    </form>
  );
}
