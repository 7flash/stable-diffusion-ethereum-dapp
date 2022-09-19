import { Box, Button, Heading, Input } from '@chakra-ui/react';
import { Default } from 'components/layouts/Default';
import { Create } from 'components/templates/create';
import type { NextPage } from 'next';
import { useRef, useState } from 'react';
import { erc721ABI, usePrepareContractWrite, useContractWrite } from 'wagmi';

import { contractAddress } from "../src/constants";

const MintPage: NextPage = () => {
  const [dataUri, setDataUri] = useState('');
  
  const { config, error, isError } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: ['function create(string uri)'],
    functionName: 'create',
    args: dataUri,
  })
  const { data, write } = useContractWrite(config);

  const inputUri = useRef();
  const [isDisabled, setDisabled] = useState(false);
  
  const onClick = () => {
    setDisabled(true);

    const uri = inputUri.current.value;

    write();

    console.log(uri);

    setDisabled(false);
  }

  return (
    <Default pageName="Mint">
      <Heading size="lg" marginBottom={6}>
        Mint New Token
      </Heading>
      <Box padding="24px 18px">
        <Input type="text" ref={inputUri} placeholder="Image URL" value={dataUri} onChange={(e) => setDataUri(e.target.value)} />
        <Button isDisabled={!write} onClick={onClick}>Send Transaction</Button>
      </Box>
      {
        isError && <div>
          Error: {error.message}
        </div>
      }
    </Default>
  );
};

export default MintPage;
