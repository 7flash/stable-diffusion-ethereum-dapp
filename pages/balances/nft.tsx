import { Default } from 'components/layouts/Default';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { INFTBalances } from 'components/templates/balances/NFT/types';
import { NFTBalances } from 'components/templates/balances/NFT';
import Moralis from 'moralis';

import { cronosTestnet, contractAddress } from "../../src/constants";

const ERC20: NextPage<INFTBalances> = (props) => {
  return (
    <Default pageName="NFT Balances">
      <NFTBalances {...props} />
    </Default>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  // if (!session?.user.address) {
  //   return { props: { error: 'Connect your wallet first' } };
  // }

  // const owners = await Moralis.EvmApi.token.getNFTOwners({
  //   chain: cronosTestnet.id,
  //   address: contractAddress,
  // })

  // const owner = owners.result[0].format().ownerOf;

  // console.log(owner);

  // return {
  //   props: {
  //     balances: JSON.parse(JSON.stringify(owners.result)),
  //   },
  // };  

  // const allOwners = new Set()
  // for (const owner of owners.result) {
  //   console.log(owner.result.ownerOf?.format());
  //   allOwners.add(owner);
  // }

  // return { props: { error: 'Connect your wallet first' } };

  const balances = await Moralis.EvmApi.token.getAllTokenIds({
    address: contractAddress,
    chain: cronosTestnet.id,
  });


  // (balances.result).filter((balance)=> balance.result.)

  return {
    props: {
      balances: JSON.parse(JSON.stringify(balances.result)),
    },
  };
};

export default ERC20;
