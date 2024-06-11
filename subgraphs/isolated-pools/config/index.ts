import arbitrumDeployments from '@venusprotocol/isolated-pools/deployments/arbitrumone_addresses.json';
import arbitrumSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/arbitrumsepolia_addresses.json';
import bscMainnetDeployments from '@venusprotocol/isolated-pools/deployments/bscmainnet_addresses.json';
import chapelDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet_addresses.json';
import ethereumDeployments from '@venusprotocol/isolated-pools/deployments/ethereum_addresses.json';
import opBnbMainnetDeployments from '@venusprotocol/isolated-pools/deployments/opbnbmainnet_addresses.json';
import sepoliaDeployments from '@venusprotocol/isolated-pools/deployments/sepolia.json';
import fs from 'fs';
import Mustache from 'mustache';

export const getNetwork = () => {
  const supportedNetworks = [
    'mainnet',
    'sepolia',
    'chapel',
    'bsc',
    'docker',
    'opbnbMainnet',
    'arbitrumSepolia',
    'arbitrum',
  ] as const;
  const network = process.env.NETWORK;
  // @ts-expect-error network env var is unknown here
  if (!supportedNetworks.includes(network)) {
    throw new Error(`NETWORK env var must be set to one of ${supportedNetworks}`);
  }
  return network as (typeof supportedNetworks)[number];
};

const main = () => {
  const network = getNetwork();
  const config = {
    docker: {
      network: 'hardhat',
      poolRegistryAddress: '0xB06c856C8eaBd1d8321b687E188204C1018BC4E5',
      poolLensAddress: '0xaB7B4c595d3cE8C85e16DA86630f2fc223B05057',
      startBlock: 0,
      poolLensRevision: '/PoolLens.sol/PoolLens.json',
    },
    mainnet: {
      network: 'mainnet',
      poolRegistryAddress: ethereumDeployments.addresses.PoolRegistry,
      poolLensAddress: ethereumDeployments.addresses.PoolLens,
      startBlock: '18968000',
      poolLensRevision: '/legacy/PoolLensR1.sol/PoolLensR1.json',
    },
    sepolia: {
      network: 'sepolia',
      poolRegistryAddress: sepoliaDeployments.contracts.PoolRegistry.address,
      poolLensAddress: sepoliaDeployments.contracts.PoolLens.address,
      startBlock: '3930059',
      poolLensRevision: '/legacy/PoolLensR1.sol/PoolLensR1.json',
    },
    chapel: {
      network: 'chapel',
      poolRegistryAddress: chapelDeployments.addresses.PoolRegistry,
      poolLensAddress: '0x559936086C5f65b92240012ae0D2F70C082Ac0b0',
      startBlock: '30870000',
      poolLensRevision: '/legacy/PoolLensR1.sol/PoolLensR1.json',
    },
    bsc: {
      network: 'bsc',
      poolRegistryAddress: bscMainnetDeployments.addresses.PoolRegistry,
      poolLensAddress: '0xe12da02820fAD83e0369C6De7Ae30721eaB60E32',
      startBlock: '29300000',
      poolLensRevision: '/legacy/PoolLensR1.sol/PoolLensR1.json',
    },
    opbnbMainnet: {
      network: 'opbnb-mainnet',
      poolRegistryAddress: opBnbMainnetDeployments.addresses.PoolRegistry,
      poolLensAddress: opBnbMainnetDeployments.addresses.PoolLens,
      startBlock: '16232873',
      poolLensRevision: '/legacy/PoolLensR1.sol/PoolLensR1.json',
    },
    arbitrumSepolia: {
      network: 'arbitrum-sepolia',
      poolRegistryAddress: arbitrumSepoliaDeployments.addresses.PoolRegistry,
      poolLensAddress: arbitrumSepoliaDeployments.addresses.PoolLens,
      startBlock: '44214769',
      poolLensRevision: '/PoolLens.sol/PoolLens.json',
    },
    arbitrum: {
      network: 'arbitrum-one',
      poolRegistryAddress: arbitrumDeployments.addresses.PoolRegistry,
      poolLensAddress: arbitrumDeployments.addresses.PoolLens,
      startBlock: '216184381',
      poolLensRevision: '/PoolLens.sol/PoolLens.json',
    },
  };

  Mustache.escape = function (text) {
    return text;
  };

  const yamlTemplate = fs.readFileSync('template.yaml', 'utf8');
  const yamlOutput = Mustache.render(yamlTemplate, config[network]);
  fs.writeFileSync('subgraph.yaml', yamlOutput);

  const configTemplate = fs.readFileSync('src/constants/config-template', 'utf8');
  const tsOutput = Mustache.render(configTemplate, config[network]);
  fs.writeFileSync('src/constants/config.ts', tsOutput);
};

main();
