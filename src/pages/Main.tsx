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
import { settingsOutline, addCircleOutline, closeCircle } from "ionicons/icons";
import { Plugins } from "@capacitor/core";

const Main: React.FC = () => {
  const { Storage } = Plugins;
  const exampleAsset = {
    Name: "Example1",
    Quantity: 100,
    Currency: "CAD",
  };

  const [loadCount, setLoadCount] = useState(0);
  const [currencyList, setCurrencyList] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

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
  }, [assetList]);

  // on function load set up
  useEffect(() => {
    Storage.get({ key: "assets" }).then((ret) => {
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
      getCurrencyList();
    });
  }, []);

  // deletes an asset in assetList
  const deleteAsset = (asset: any) => {
    setAssetList(assetList.filter((item) => item["Name"] !== asset["Name"]));
  };

  const getCurrencyList = () => {
    fetch("https://api.exchangeratesapi.io/latest")
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        // Note: base is EUR
        console.log(response["rates"]);
        setCurrencyList(response["rates"]);
        // TODO: store currency list to storage
      })
      .catch((err) => {
        // TODO: get existing storage currency list
        console.log(err);
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
            <IonIcon className="settingIcon" icon={settingsOutline}></IonIcon>
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
              <IonItem>
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
                  onClick={() => deleteAsset(asset)}
                  color="danger"
                >
                  Delete
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
            <IonRow>
              <IonCol size="6">
                <IonButton
                  onClick={() => setShowAddModal(false)}
                  expand="block"
                  fill="outline"
                  size="default"
                  color="medium"
                  href="/"
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

        <IonFooter>
          <IonToolbar>
            <IonTitle>Click to Add Text</IonTitle>
            {/* <ion-buttons slot="end">
              <ion-button id="changeText" onClick="toggleText()">
                <ion-icon slot="start" name="refresh"></ion-icon>
              </ion-button>
            </ion-buttons> */}
          </IonToolbar>
        </IonFooter>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonTitle>Click to Add Text</IonTitle>
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
