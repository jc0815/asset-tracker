import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButton,
  IonRow,
  IonItem,
  IonLabel,
  IonCol,
  IonGrid,
  IonModal,
  IonInput,
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonFooter,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Main.css";
import {
  settingsOutline,
  addCircleOutline,
  closeCircle,
  trash,
} from "ionicons/icons";
import { Plugins } from "@capacitor/core";
import { AssertionError } from "assert";

const Main: React.FC = () => {
  const { Storage } = Plugins;
  const exampleAsset = {
    Name: "Example1",
    Quantity: 100,
    Currency: "CAD",
  };

  const [loadCount, setLoadCount] = useState(0); // count for function on load
  const [total, setTotal] = useState(String); // total asset amount
  const [currencyList, setCurrencyList] = useState({}); // list of currency rates

  const [assetList, setAssetList] = useState([exampleAsset]); // list of assets
  const [newAssetName, setNewAssetName] = useState(""); // state of asset name (modal)
  const [newAssetQuant, setNewAssetQuant] = useState(0); // state of asset quantity (modal)
  const [newAssetCurrency, setNewAssetCurrency] = useState("CAD"); // state of asset currency (modal)

  const [showAddModal, setShowAddModal] = useState(false); // add new asset modal state
  const [showEditModal, setShowEditModal] = useState(false); // edit new asset modal state
  const [currentEditingAsset, setCurrentEditingAsset] = useState({
    Name: "Example1",
    Quantity: 100,
    Currency: "CAD",
    Index: 1,
  });

  const [currentCurrency, setCurrentCurrency] = useState("CAD");
  //change the current currency for total
  const changeCurrentCurrency = (toCurrency: string) => {
    let value = convertCurrency(currentCurrency, toCurrency, +total).toFixed(2);
    setCurrentCurrency(toCurrency);
    setTotal(value);
  };

  // save asset list to local storage
  async function setAssetsStorage() {
    await Storage.set({
      key: "assets",
      value: JSON.stringify(assetList),
    });
  }

  // add a new asset (modal add is pressed)
  const onAssetSubmit = () => {
    console.log("submit");
    const newAsset = {
      Name: newAssetName,
      Quantity: newAssetQuant,
      Currency: newAssetCurrency.toUpperCase(),
    };
    if (newAssetName && newAssetQuant && newAssetCurrency) {
      setAssetList((assetList) => [...assetList, newAsset]);
    }
    setShowAddModal(false);
    resetModal();
  };

  // edit current asset (tap on asset item)
  const onAssetEdit = () => {
    let currentAsset = assetList[currentEditingAsset["Index"]];
    currentAsset["Name"] = newAssetName;
    currentAsset["Quantity"] = newAssetQuant;
    currentAsset["Currency"] = newAssetCurrency;
    if (newAssetName && newAssetQuant && newAssetCurrency) {
      setAssetList((assetList) => [...assetList]);
    }
    setShowEditModal(false);
  };

  // reset modal values
  const resetModal = () => {
    setNewAssetName("");
    setNewAssetQuant(0);
    setNewAssetCurrency("CAD");
  };

  // run everytime asset list changes
  useEffect(() => {
    if (loadCount >= 1) {
      // once function and storage has loaded
      setAssetsStorage(); // get and set assets
      calculateTotal(); // calculate total (iterate through assets)
    }
  }, [assetList]);

  // run everytime currency list changes
  useEffect(() => {
    calculateTotal(); // calculate total (iterate through assets)
  }, [currencyList]);

  // initial function load
  useEffect(() => {
    getCurrencyList(); // get currency list (via API)

    Storage.get({ key: "assets" }).then((ret) => {
      // get local storage of assets
      var returnValue = JSON.parse(ret.value || "{}"); // get storage asset object, otherwise empty object
      var newList: any = [];
      for (let asset in returnValue) {
        // iterate through storage asset object
        newList.push({
          Name: returnValue[asset].Name,
          Quantity: returnValue[asset].Quantity,
          Currency: returnValue[asset].Currency,
        });
      }
      if (newList.length > 0) {
        // if storage asset object is not empty
        setAssetList(newList); // store found object
      }
    });

    setLoadCount(1); // useEffect for currencyList is now active
  }, []);

  // calculate total by iterating asset list
  const calculateTotal = () => {
    let tempTotal = 0; // initialize total sum
    assetList.forEach((asset) => {
      // iterate through each asset
      // convert each currency to CAD and add to sum
      tempTotal += convertCurrency(asset["Currency"], "CAD", asset["Quantity"]);
    });
    setTotal(tempTotal.toFixed(2)); // set total
  };

  // deletes an asset in assetList
  const deleteAsset = (index: any) => {
    const tempAsset = [...assetList];
    tempAsset.splice(index, 1);
    setAssetList(tempAsset);
  };

  // get the currency list (via exchange rates API)
  const getCurrencyList = () => {
    return fetch("https://api.exchangeratesapi.io/latest")
      .then((res) => {
        // gets result and return promise JSON
        return res.json();
      })
      .then((response) => {
        // gets JSON response from promise
        // Note: base is EUR
        setCurrencyList(response["rates"]); // set currency list as response
        setCurrencyStorage(response["rates"]); // store response to storage
        return response;
      })
      .catch((err) => {
        // if API fetch fails
        getCurrencyStorage().then((res) => {
          // then use previous storage currency list
          setCurrencyList(res);
        });
        console.log(err);
      });
  };

  // render edit asset
  const renderEditAsset = (
    name: string,
    quantity: number,
    currency: string,
    index: number
  ) => {
    const temp = {
      Name: name,
      Quantity: quantity,
      Currency: currency,
      Index: index,
    };
    setCurrentEditingAsset(temp); // set current selected asset
    setNewAssetCurrency(currency); // set current selected currency
    setNewAssetName(name); // set current selected name
    setNewAssetQuant(quantity); // set current selected quantity
    setShowEditModal(true); // show edit modal
  };

  // store currency list to storage
  async function setCurrencyStorage(currencyList: any) {
    await Storage.set({
      key: "currency",
      value: JSON.stringify(currencyList),
    });
  }

  // get currency list from storage
  const getCurrencyStorage = () => {
    return Storage.get({ key: "currency" }).then((response) => {
      return response;
    });
  };

  // convert currency
  const convertCurrency = (
    fromCurrency: string,
    toCurrency: string,
    quantity: number
  ) => {
    const fromRate = parseFloat(Object(currencyList)[fromCurrency]);
    const toRate = parseFloat(Object(currencyList)[toCurrency]);
    return quantity * (toRate / fromRate);
  };

  return (
    <IonPage>
      {/* 
        ----------------
        Header
        ----------------
      */}
      <IonHeader>
        <IonToolbar>
            <IonTitle className="main-title">Virtual Wallet</IonTitle>
            {/* <IonIcon className="settingIcon" icon={settingsOutline}></IonIcon> */}
        </IonToolbar>
      </IonHeader>

      {/* 
        ----------------
        Content
        ----------------
      */}
      <IonContent className="content-main">
        {/* 
          ----------------
          List Title
          ----------------
        */}
        <IonItem className="asset-title">
          {/* TODO: be able to change name */}
          My Asset Portfolio
        </IonItem>

        {/* 
          ----------------
          Asset List
          ----------------
        */}
        {assetList.map(function (asset, index) {
          return (
            <IonItemSliding key={index}>
              <IonItem
                onClick={() =>
                  renderEditAsset(
                    asset["Name"],
                    asset["Quantity"],
                    asset["Currency"],
                    index
                  )
                }
                className="asset-item"
              >
                <IonLabel>{asset["Name"]}</IonLabel>
                <div className="asset-quant-price">
                  <IonLabel>{asset["Quantity"]}</IonLabel>
                  <span>$</span>
                  <IonLabel>{asset["Currency"]}</IonLabel>
                </div>
                {/* <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonLabel>{asset["Name"]}</IonLabel>
                    </IonCol>
                    <IonCol>
                      <IonLabel>{asset["Quantity"]}</IonLabel>
                    </IonCol>
                    <IonCol>
                      <IonLabel>{asset["Currency"]}</IonLabel>
                    </IonCol>
                  </IonRow>
                </IonGrid> */}
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption
                  onClick={() => deleteAsset(index)}
                  color="danger"
                >
                  <IonIcon icon={trash}></IonIcon>
                  Delete›
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          );
        })}

        {/* 
          ----------------
          Add Asset Button 
          ----------------
        */}
        {/* <IonItem> */}
          {/* <IonButton size="small" fill="solid" href="/tab2"> */}
        <div className="add-asset">
          <IonButton
            size="small"
            fill="solid"
            onClick={() => setShowAddModal(true)}
            className="add-asset-button"
          >
            {/* New Asset */}
            <IonIcon icon={addCircleOutline}></IonIcon>
          </IonButton>
        </div>
        {/* </IonItem> */}

        {/* 
          ----------------
          Add Asset Modal (default: false)
          ----------------
        */}
        <IonModal isOpen={showAddModal} cssClass="addModal">
          <IonList lines="full">
            <IonItem>
              <IonLabel position="floating">Name</IonLabel>
              {/* the floating will float the label */}
              <IonInput
                onIonChange={(e: any) => {
                  setNewAssetName(e.detail.value);
                }}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Quantity</IonLabel>
              <IonInput
                type="number"
                onIonChange={(e: any) => {
                  setNewAssetQuant(e.detail.value);
                }}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Currency</IonLabel>
              <IonSelect
                value={newAssetCurrency}
                placeholder="Default: CAD"
                className="currency-select"
                onIonChange={(e: any) => {
                  setNewAssetCurrency(e.detail.value);
                }}
              >
                {Object.keys(currencyList).map((keyName, i) => (
                  <IonSelectOption value={keyName}>{keyName}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonRow className="cancelAdd">
              <IonCol size="6">
                <IonButton
                  onClick={() => setShowAddModal(false)}
                  expand="block"
                  fill="outline"
                  size="default"
                  color="medium"
                >
                  {/* size = small,default and large */}
                  Cancel
                </IonButton>
              </IonCol>
              <IonCol size="6">
                <IonButton
                  expand="block"
                  color="success"
                  onClick={() => onAssetSubmit()}
                >
                  Add
                </IonButton>
              </IonCol>
            </IonRow>
          </IonList>
        </IonModal>

        {/* 
          ----------------
          Edit Asset Modal (default: false)
          ----------------
        */}
        <IonModal isOpen={showEditModal} cssClass="addModal">
          <IonList lines="full">
            <IonItem>
              <IonLabel position="floating">Name</IonLabel>
              {/* the floating will float the label */}
              <IonInput
                placeholder={currentEditingAsset["Name"]}
                onIonChange={(e: any) => {
                  setNewAssetName(e.detail.value);
                }}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Quantity</IonLabel>
              <IonInput
                placeholder={currentEditingAsset["Quantity"] + ""}
                type="number"
                onIonChange={(e: any) => {
                  setNewAssetQuant(e.detail.value);
                }}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="fixed">Currency</IonLabel>
              <IonSelect
                value={newAssetCurrency}
                placeholder="Default: CAD"
                onIonChange={(e: any) => {
                  setNewAssetCurrency(e.detail.value);
                }}
              >
                {Object.keys(currencyList).map((keyName, i) => (
                  <IonSelectOption value={keyName}>{keyName}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonRow className="cancelAdd">
              <IonCol size="6">
                <IonButton
                  onClick={() => setShowEditModal(false)}
                  expand="block"
                  fill="outline"
                  size="default"
                  color="medium"
                >
                  {/* size = small,default and large */}
                  Cancel
                </IonButton>
              </IonCol>
              <IonCol size="6">
                <IonButton
                  expand="block"
                  color="success"
                  onClick={() => onAssetEdit()}
                >
                  Submit
                </IonButton>
              </IonCol>
            </IonRow>
          </IonList>
        </IonModal>
        {/* end of edit modal */}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          {/* <IonGrid>
            <IonRow>
              <IonCol>
                <h5>Total {total}</h5>
              </IonCol>
              <IonCol>
                <IonSelect
                  value={currentCurrency}
                  placeholder={"Default: " + currentCurrency}
                  onIonChange={(e: any) => {
                    changeCurrentCurrency(e.detail.value);
                  }}
                >
                  {Object.keys(currencyList).map((keyName, i) => (
                    <IonSelectOption value={keyName}>{keyName}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonCol>
            </IonRow>
          </IonGrid> */}
          <IonGrid className="total-content">
                <h5>Total:</h5>
                <div>
                  <h5>{total}</h5>
                  <IonSelect
                      value={currentCurrency}
                      placeholder={currentCurrency}
                      onIonChange={(e: any) => {
                        changeCurrentCurrency(e.detail.value);
                      }}
                      style={{marginTop: '5px'}}
                    >
                      {Object.keys(currencyList).map((keyName, i) => (
                        <IonSelectOption value={keyName}>{keyName}</IonSelectOption>
                      ))}
                    </IonSelect>
                </div>
          </IonGrid>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Main;
