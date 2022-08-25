// utilities
const NO_ADDRESS = "0x0000000000000000000000000000000000000000";

const hashOrder = (web3) => (order) => {
  return web3.utils
    .soliditySha3(
      { type: "address", value: order.exchange },
      { type: "address", value: order.maker },
      { type: "address", value: order.taker },
      { type: "uint", value: order.makerRelayerFee },
      { type: "uint", value: order.takerRelayerFee },
      { type: "uint", value: order.makerProtocolFee },
      { type: "uint", value: order.takerProtocolFee },
      { type: "address", value: order.feeRecipient },
      { type: "uint8", value: order.feeMethod },
      { type: "uint8", value: order.side },
      { type: "uint8", value: order.saleKind },
      { type: "address", value: order.target },
      { type: "uint8", value: order.howToCall },
      { type: "bytes", value: order.calldata },
      { type: "bytes", value: order.replacementPattern },
      { type: "address", value: order.staticTarget },
      { type: "bytes", value: order.staticExtradata },
      { type: "address", value: order.paymentToken },
      { type: "uint", value: order.basePrice },
      { type: "uint", value: order.extra },
      { type: "uint", value: order.listingTime },
      { type: "uint", value: order.expirationTime },
      { type: "uint", value: order.salt }
    )
    .toString("hex");
};

const wyv = {
  initialize: (exchange, buyer, seller, isBuyer = true) => {
    return {
      exchange: exchange,
      maker: isBuyer ? buyer : seller,
      taker: isBuyer ? seller : buyer,
      side: isBuyer ? 0 : 1,
    };
  },
  transactionCharges: (
    isBuyer = true,
    feeMethod = 1,
    shareType = "both",
    commissionRecipient = NO_ADDRESS,
    commissionFee = 0,
    platformFee = 0
  ) => {
    switch (shareType) {
      case "buyerOnly":
        return {
          makerRelayerFee: 0,
          takerRelayerFee: commissionFee,
          makerProtocolFee: 0,
          takerProtocolFee: platformFee,
          feeRecipient: isBuyer ? NO_ADDRESS : commissionRecipient,
          feeMethod: feeMethod,
        };
      case "sellerOnly":
        return {
          makerRelayerFee: commissionFee,
          takerRelayerFee: 0,
          makerProtocolFee: platformFee,
          takerProtocolFee: 0,
          feeRecipient: commissionRecipient,
          feeMethod: feeMethod,
        };
      default:
        return {
          makerRelayerFee: Math.ceil(commissionFee / 2), // make the seller pay the remaining remainders
          takerRelayerFee: Math.floor(commissionFee / 2),
          makerProtocolFee: Math.ceil(platformFee / 2), // make the seller pay the remaining remainders
          takerProtocolFee: Math.floor(platformFee / 2),
          feeRecipient: commissionRecipient,
          feeMethod: feeMethod,
        };
    }
  },
  actionInPurchase: (
    contractTarget = NO_ADDRESS,
    callData = "0x",
    replacementPattern = "0x",
    howToExecute = 0
  ) => {
    return {
      target: contractTarget,
      howToCall: howToExecute,
      calldata: callData,
      replacementPattern: replacementPattern,
    };
  },
  actionAfterPurchase: (contractTarget = NO_ADDRESS, callData = "0x") => {
    return {
      staticTarget: contractTarget,
      staticExtradata: callData,
    };
  },
  price: (payment_method = false, basePrice = 0, extra = 0) => {
    return {
      paymentToken: payment_method ? payment_method : NO_ADDRESS,
      basePrice: basePrice,
      extra: extra,
    };
  },
  time: (listingTime = 0, expirationTime = 0) => {
    return {
      listingTime: listingTime,
      expirationTime: expirationTime,
    };
  },
  etc: (saleKind = 0, salt = -1) => {
    return {
      saleKind: saleKind,
      salt: salt == -1 ? Math.floor(Math.random() * 10000) : salt,
    };
  },
};

// Order Object Creator
const wyver =
  (web3) =>
  async (listingData, createSignature = false) => {
    const takerHash = hashOrder(web3)(listingData);
    let r, s, v;
    if (createSignature) {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      let tSignature = await web3.eth.personal.sign(takerHash, accounts[0]);
      tSignature = tSignature.slice(2);
      r = "0x" + tSignature.slice(0, 64);
      s = "0x" + tSignature.slice(64, 128);
      v = "0x" + tSignature.slice(128, 130);
    } else {
      r =
        "0x" +
        "0000000000000000000000000000000000000000000000000000000000000000";
      s =
        "0x" +
        "0000000000000000000000000000000000000000000000000000000000000000";
      v = "0x" + "00";
    }

    const assembledOrder = [
      [
        listingData.exchange,
        listingData.maker,
        listingData.taker,
        listingData.feeRecipient,
        listingData.target,
        listingData.staticTarget,
        listingData.paymentToken,
      ],
      [
        listingData.makerRelayerFee,
        listingData.takerRelayerFee,
        listingData.makerProtocolFee,
        listingData.takerProtocolFee,
        listingData.basePrice,
        listingData.extra,
        listingData.listingTime,
        listingData.expirationTime,
        listingData.salt,
      ],
      listingData.feeMethod,
      listingData.side,
      listingData.saleKind,
      listingData.howToCall,
      listingData.calldata,
      listingData.replacementPattern,
      listingData.staticExtradata,
      v,
      r,
      s,
    ];

    return {
      hash: takerHash,
      listingData,
      assembledOrder,
      v,
      r,
      s,
    };
  };

// check if orders are compatible and return matchPrice
const checkMatch = (wyvernExchange) => async (buyOrdder, sellOrder) => {
  const { listingData: buy, assembledOrder: buyAss, hash: buyHash } = buyOrdder;
  const { listingData: sell, assembledOrder: sellAss, hash: sellHash } = sellOrder;

  try {
    // let _hashCheck = await wyvernExchange.methods
    //   .hashOrder_(
    //     ...buyAss.slice(0,9),
    //   )
    //   .call();

    // let _validateOrderParams = await wyvernExchange.methods
    //   .validateOrder_(
    //     ...buyAss,
    //   )
    //   .call();

    // let _validateListingParams = await wyvernExchange.methods
    //   .validateOrder_(
    //     ...sellAss,
    //   )
    //   .call();
    
    // console.log(buyAss, sellAss);
    // console.log(_validateOrderParams, _validateListingParams);

    let _matchStatus = await wyvernExchange.methods
      .ordersCanMatch_(
        [
          buy.exchange,
          buy.maker,
          buy.taker,
          buy.feeRecipient,
          buy.target,
          buy.staticTarget,
          buy.paymentToken,
          sell.exchange,
          sell.maker,
          sell.taker,
          sell.feeRecipient,
          sell.target,
          sell.staticTarget,
          sell.paymentToken,
        ],
        [
          buy.makerRelayerFee,
          buy.takerRelayerFee,
          buy.makerProtocolFee,
          buy.takerProtocolFee,
          buy.basePrice,
          buy.extra,
          buy.listingTime,
          buy.expirationTime,
          buy.salt,
          sell.makerRelayerFee,
          sell.takerRelayerFee,
          sell.makerProtocolFee,
          sell.takerProtocolFee,
          sell.basePrice,
          sell.extra,
          sell.listingTime,
          sell.expirationTime,
          sell.salt,
        ],
        [
          buy.feeMethod,
          buy.side,
          buy.saleKind,
          buy.howToCall,
          sell.feeMethod,
          sell.side,
          sell.saleKind,
          sell.howToCall,
        ],
        buy.calldata,
        sell.calldata,
        buy.replacementPattern,
        sell.replacementPattern,
        buy.staticExtradata,
        sell.staticExtradata
      )
      .call();

    // if (!( _validateOrderParams && _validateListingParams)){
    //   console.log("Invalid Parameters");
    //   return false;
    // }

    if (!(_matchStatus)) {
      console.log("Orders cannot match");
      return false;
    }

    let _mathPrice = await wyvernExchange.methods
      .calculateMatchPrice_(
        [
          buy.exchange,
          buy.maker,
          buy.taker,
          buy.feeRecipient,
          buy.target,
          buy.staticTarget,
          buy.paymentToken,
          sell.exchange,
          sell.maker,
          sell.taker,
          sell.feeRecipient,
          sell.target,
          sell.staticTarget,
          sell.paymentToken,
        ],
        [
          buy.makerRelayerFee,
          buy.takerRelayerFee,
          buy.makerProtocolFee,
          buy.takerProtocolFee,
          buy.basePrice,
          buy.extra,
          buy.listingTime,
          buy.expirationTime,
          buy.salt,
          sell.makerRelayerFee,
          sell.takerRelayerFee,
          sell.makerProtocolFee,
          sell.takerProtocolFee,
          sell.basePrice,
          sell.extra,
          sell.listingTime,
          sell.expirationTime,
          sell.salt,
        ],
        [
          buy.feeMethod,
          buy.side,
          buy.saleKind,
          buy.howToCall,
          sell.feeMethod,
          sell.side,
          sell.saleKind,
          sell.howToCall,
        ],
        buy.calldata,
        sell.calldata,
        buy.replacementPattern,
        sell.replacementPattern,
        buy.staticExtradata,
        sell.staticExtradata
      )
      .call();

    if (!(_mathPrice == buy.basePrice)) {
      console.log(
        `Orders have different match price (${_mathPrice}) and buy price (${buy.basePrice})`
      );
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }

  return true;
};

// execute order
const createConfirmOrderObject =
  (wyvernExchange) => async (buyOrdder, sellOrder) => {
    const { listingData: buy, v: bv, r: br, s: bs } = buyOrdder;
    const { listingData: sell, v: sv, r: sr, s: ss } = sellOrder;

    if (!checkMatch(wyvernExchange)(buyOrdder, sellOrder)) {
      return false;
    }

    return [
      [
        buy.exchange,
        buy.maker,
        buy.taker,
        buy.feeRecipient,
        buy.target,
        buy.staticTarget,
        buy.paymentToken,
        sell.exchange,
        sell.maker,
        sell.taker,
        sell.feeRecipient,
        sell.target,
        sell.staticTarget,
        sell.paymentToken,
      ],
      [
        buy.makerRelayerFee,
        buy.takerRelayerFee,
        buy.makerProtocolFee,
        buy.takerProtocolFee,
        buy.basePrice,
        buy.extra,
        buy.listingTime,
        buy.expirationTime,
        buy.salt,
        sell.makerRelayerFee,
        sell.takerRelayerFee,
        sell.makerProtocolFee,
        sell.takerProtocolFee,
        sell.basePrice,
        sell.extra,
        sell.listingTime,
        sell.expirationTime,
        sell.salt,
      ],
      [
        buy.feeMethod,
        buy.side,
        buy.saleKind,
        buy.howToCall,
        sell.feeMethod,
        sell.side,
        sell.saleKind,
        sell.howToCall,
      ],
      buy.calldata,
      sell.calldata,
      buy.replacementPattern,
      sell.replacementPattern,
      buy.staticExtradata,
      sell.staticExtradata,
      [bv, sv],
      [
        br,
        bs,
        sr,
        ss,
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ],
    ];
  };

export default {
  wyv,
  wyver,
  checkMatch,
  createConfirmOrderObject,
  NO_ADDRESS,
};
