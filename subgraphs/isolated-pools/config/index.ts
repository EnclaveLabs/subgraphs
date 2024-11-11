import fs from 'fs';
import Mustache from 'mustache';

export const getNetwork = () => {
  const supportedNetworks = [
    'ethereum',
    'sepolia',
    'chapel',
    'bsc',
    'docker',
    'opbnbMainnet',
    'arbitrumSepolia',
    'arbitrum',
    'zksyncSepolia',
    'zksync',
    'optimismSepolia',
    'optimism',
  ] as const;
  const network = 'arbitrum'; //TOFIX should come from env

  if (!supportedNetworks.includes(network)) {
    throw new Error(`NETWORK env var must be set to one of ${supportedNetworks}`);
  }
  return network as (typeof supportedNetworks)[number];
};

const main = () => {
  const network = getNetwork();
  const config = {
    arbitrum: {
      network: 'arbitrum-one',
      poolRegistryAddress: '0x382238f07Bc4Fe4aA99e561adE8A4164b5f815DA',
      startBlock: '271252039',
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
