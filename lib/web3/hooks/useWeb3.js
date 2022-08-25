import { useEffect, useRef, useState } from "react";
import Web3 from "web3";

function networkIDNames(networkID) {
  switch (String(networkID)) {
    case "1":
      return "Mainnet";
    case "3":
      return "Ropsten";
    case "4":
      return "Rinkeby";
    case "42":
      return "Kovan";
    default:
      return "Unknown";
  }
}



function useWeb3(autoConnect, redirectLink) {
  const [isWeb3, setIsWeb3] = useState(false);
  const [displayAccount, setDisplayAccount] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const accountChecker = useRef(null);
  const networkChecker = useRef(null);
  const web3 = useRef(null);

  function loadData() {
    if (web3.current && !accountChecker.current) {
      // Check if the user is logged in
      web3.current.eth.net.getId().then((networkId) => {
        setCurrentNetwork(networkIDNames(networkId));
      });

      // Get the user's accounts
      web3.current.eth.getAccounts().then((accounts) => {
        if (accounts[0]) {
          setCurrentAccount(accounts[0]);
          setDisplayAccount(
            `${accounts[0].slice(0, 4)}...${accounts[0].slice(-5, -1)}`
          );
        }
      });

      // Clear already running intervals to avoid memory leaks
      accountChecker.current && clearInterval(accountChecker.current);
      networkChecker.current && clearInterval(networkChecker.current);

      // Check for account changes every second
      accountChecker.current = setInterval(() => {
        web3.current.eth.getAccounts().then((accounts) => {
          if (accounts[0] !== currentAccount && accounts[0]) {
            setCurrentAccount(accounts[0]);
            setDisplayAccount(
              `${accounts[0].slice(0, 4)}...${accounts[0].slice(-5, -1)}`
            );
          }
        });
      }, 1000);

      // Check for network changes every second
      networkChecker.current = setInterval(() => {
        web3.current.eth.net.getId().then((networkId) => {
          setCurrentNetwork(networkIDNames(networkId));
        });
      }, 1000);
    }
    setIsWeb3(!!web3.current);
  }

  function connect(redirect=true) {
    if (typeof window !== "undefined") {
      if (typeof window.ethereum !== "undefined") {
        // We are in the browser and metamask is running.
        try {
          window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (e) {
          console.log(e);
        }
        web3.current = new Web3(window.ethereum);
      } else {
        // No window.ethereum found, no metamask.
        // redirect to link
        if(redirect) window.location.href = `https://metamask.app.link/dapp/${redirectLink}`;
      }
    } else {
      // Not on the browser
    }
    loadData();
  }

  useEffect(() => {
    autoConnect && connect(!autoConnect);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Web3]);

  return { isWeb3, currentAccount, displayAccount, currentNetwork, connect, web3: web3.current };
}

export default useWeb3;
