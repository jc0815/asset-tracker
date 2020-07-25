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

  const [loadCount, setLoadCount] = useState(0);
  const [total, setTotal] = useState(String);
  const [currencyList, setCurrencyList] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditingAsset, setCurrentEditingAsset] = useState({
    Name: "Example1",
    Quantity: 100,
    Currency: "CAD",
    Index: 1,
  });

  const [assetList, setAssetList] = useState([exampleAsset]);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetQuant, setNewAssetQuant] = useState(0);
  const [newAssetCurrency, setNewAssetCurrency] = useState("CAD");

  // save assets to local storage
  async function setAssetsStorage() {
    await Storage.set({
      key: "assets",
      value: JSON.stringify(assetList),
    });
  }

  // add a new asset
  const onAssetSubmit = () => {
    console.log("submit");
    const newAsset = {
      Name: newAssetName,
      Quantity: newAssetQuant,
      Currency: newAssetCurrency.toUpperCase(),
    };
    setAssetList((assetList) => [...assetList, newAsset]);
    setShowAddModal(false);
    resetModal();
  };

  //edit current asset
  const onAssetEdit = () => {
    let currentAsset = assetList[currentEditingAsset["Index"]];
    currentAsset["Name"] = newAssetName;
    currentAsset["Quantity"] = newAssetQuant;
    currentAsset["Currency"] = newAssetCurrency;
    setAssetList((assetList) => [...assetList]);
    setShowEditModal(false);
  };

  // reset modal values
  const resetModal = () => {
    setNewAssetName("");
    setNewAssetQuant(0);
    setNewAssetCurrency("CAD");
  };

  // run everytime assetList changes
  useEffect(() => {
    if (loadCount >= 1) {
      // console.log("set asset list: " + JSON.stringify(assetList));
      setAssetsStorage();
    }

    let tempTotal = 0;
    console.log("useEffect: currenyList is ", currencyList);
    assetList.forEach((asset) => {
      tempTotal += convertCurrency(asset["Currency"], "CAD", asset["Quantity"]);
    });
    console.log("useEffect: tempTotal is ", tempTotal);
    setTotal(tempTotal.toFixed(2));
  }, [assetList, currencyList]);

  useEffect(() => {}, [currencyList]);
  // on function load set up
  useEffect(() => {
    Storage.get({ key: "assets" }).then((ret) => {
      getCurrencyList();
      var returnValue = JSON.parse(ret.value || "{}");
      var newList: any = [];
      for (let asset in returnValue) {
        newList.push({
          Name: returnValue[asset].Name,
          Quantity: returnValue[asset].Quantity,
          Currency: returnValue[asset].Currency,
        });
      }
      if (newList.length > 1) {
        setAssetList(newList);
      }
      // console.log("Retrieved list: " + JSON.stringify(newList));
      setLoadCount(1);
    });
  }, []);

  // deletes an asset in assetList
  const deleteAsset = (index: any) => {
    console.log(assetList);
    const tempAsset = [...assetList];
    tempAsset.splice(index, 1);
    // console.log("tempAsset", tempAsset);
    setAssetList(tempAsset);
  };

  //get the currency list
  const getCurrencyList = () => {
    return fetch("https://api.exchangeratesapi.io/latest")
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        // Note: base is EUR
        //console.log(response["rates"]);
        setCurrencyList(response["rates"]);
        // TODO: store currency list to storage
        //console.log(response["rates"]);
        setCurrencyStorage(response["rates"]);
        // console.log("getCurrencyList: the currencyList is ", currencyList);
        return response;
      })
      .catch((err) => {
        // TODO: get existing storage currency list
        // if fetching fails set the currnecyList using the storage
        getAssetsStorage().then((res) => {
          setCurrencyList(res);
        });
        console.log(err);
      });
  };

  //render edit asset
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
    setCurrentEditingAsset(temp);
    setNewAssetCurrency(currency);
    setNewAssetName(name);
    setNewAssetQuant(quantity);
    setShowEditModal(true);
  };

  //store currency list to storage
  async function setCurrencyStorage(currencyList: any) {
    await Storage.set({
      key: "currency",
      value: JSON.stringify(currencyList),
    });
  }
  //get currency storage
  const getAssetsStorage = () => {
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
    var fromRate = parseFloat(Object(currencyList)[fromCurrency]);
    var toRate = parseFloat(Object(currencyList)[toCurrency]);
    return quantity * (toRate / fromRate);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonRow>
            <IonTitle>Virtual Wallet</IonTitle>
            {/* <IonIcon className="settingIcon" icon={settingsOutline}></IonIcon> */}
          </IonRow>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/*-- title of the list --*/}
        <IonItem>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonLabel>Name</IonLabel>
              </IonCol>
              <IonCol>
                <IonLabel>Quantity</IonLabel>
              </IonCol>
              <IonCol>
                <IonLabel>Currency</IonLabel>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>

        {/* list showing assets */}
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
              >
                <IonGrid>
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
                </IonGrid>
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

        {/* add button icon */}
        <IonItem>
          {/* <IonButton size="small" fill="solid" href="/tab2"> */}
          <IonButton
            size="small"
            fill="solid"
            onClick={() => setShowAddModal(true)}
          >
            <IonIcon icon={addCircleOutline}></IonIcon>
          </IonButton>
        </IonItem>

        {/* addModal */}
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
              {/* <IonInput onIonChange={(e:any)=>{setNewAssetCurrency(e.detail.value);}}></IonInput> */}
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
            <IonRow
              className="cancelAdd
            
            "
            >
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

        {/* edit modal */}
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
              {/* <IonInput onIonChange={(e:any)=>{setNewAssetCurrency(e.detail.value);}}></IonInput> */}
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
          <IonTitle>Total {total}</IonTitle>
          {/* <ion-buttons slot="end">
            <ion-button id="changeText" onClick="toggleText()">
              <ion-icon slot="start" name="refresh"></ion-icon>
              </ion-button>
          </ion-buttons> */}
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Main;
