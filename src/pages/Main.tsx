import React, { useState, useEffect, useRef } from "react";
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
  useIonViewDidEnter,
  IonFooter,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Main.css";
import { settingsOutline, addCircleOutline, closeCircle } from "ionicons/icons";
import { Plugins } from "@capacitor/core";
import { AssertionError } from "assert";
import { forceUpdate } from "ionicons/dist/types/stencil-public-runtime";

const Main: React.FC = () => {
  const { Storage } = Plugins;

  const [showAddModal, setShowAddModal] = useState(false);

  const inputName = useRef<HTMLIonInputElement>(null);
  const inputQuantity = useRef<HTMLIonInputElement>(null);
  const inputCurrency = useRef<HTMLIonInputElement>(null);

  const exampleAsset = {
    Name: "Example1",
    Quantity: "100",
    Currency: "CAD",
  };

  const [assetList, setAssetList] = useState<
    { key: ""; Name: ""; Quantity: ""; Currency: "" }[] | null
  >(null);

  const [index, setIndex] = useState(1);

  // useEffect(() => {
  //   Storage.get({ key: "assets" }).then((ret) => {
  //     var returnValue = JSON.parse(ret.value || "{}");
  //     var newList: any = [];
  //     for (let asset in returnValue) {
  //       newList.push({
  //         Name: returnValue[asset].Name,
  //         Quantity: returnValue[asset].Quantity,
  //         Currency: returnValue[asset].Currency,
  //       });
  //     }
  //     if (newList.length > 1) {
  //       setAssetList(newList);
  //     }
  //   });
  // });

  useEffect(() => {
    const tempList: { key: ""; Name: ""; Quantity: ""; Currency: "" }[] = [];
    if (assetList === null) {
      console.log("the assert is null");
      keys().then((retKeys) => {
        // console.log("keys are ", retKeys);
        retKeys.forEach((key) => {
          getObject(key).then((value) => {
            tempList.push(value);
          });
        });
        setAssetList(tempList);
      });
      console.log("the tempList is ", tempList);
    }
  }, []);

  useEffect(() => {
    console.log("it's updateing");
  }, [assetList]);

  const onAssetSubmit = (name: String, quantity: Number, currency: String) => {
    clear();
    console.log(inputCurrency.current?.value);
    const newAsset = {
      key: index + "",
      Name: inputName.current?.value,
      Quantity: inputQuantity.current?.value,
      Currency: inputCurrency.current?.value,
    };
    //setAssetList((assetList) => [...assetList, newAsset]);
    setAssetsStorage(newAsset).then(() => {
      setShowAddModal(false);
      const tempIndex = index + 1;
      setIndex(tempIndex);
    });
  };

  // const deleteAsset = (asset: any) => {
  //   setAssetList(assetList.filter((item) => item["Name"] !== asset["Name"]));
  // };

  // save assets to local storage
  async function setAssetsStorage(newAsset: any) {
    //console.log(newAsset);
    await Storage.set({
      key: newAsset.key,
      value: JSON.stringify(newAsset),
    });
  }

  //
  // JSON "get" example
  async function getObject(key: any) {
    const ret = await Storage.get({ key: key });
    const value = JSON.parse(ret.value || "{}");
    return value;
  }
  // clear all items
  async function clear() {
    await Storage.clear();
  }
  // get all the keys from the storage
  async function keys() {
    const { keys } = await Storage.keys();
    console.log("Got keys: ", keys);
    return keys;
  }

  const renderAssetList = () => {
    if (assetList === null) {
      console.log("render : assetList is null");
      return <p>hellooo</p>;
    } else {
      return assetList?.map((asset, index) => {
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
                // onClick={() => deleteAsset(asset)}
                color="danger"
              >
                Delete
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
        );
      });
    }
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
        {renderAssetList()}

        {/* add button icon */}
        <IonItem>
          {/* <IonButton size="small" fill="solid" href="/tab2"> */}
          <IonButton
            size="small"
            fill="solid"
            onClick={() => {
              setShowAddModal(true);
              console.log("the assertlist is ", assetList);
            }}
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
                ref={inputName}
                // onIonChange={(e: any) => {
                //   setNewAssetName(e.detail.value);
                // }}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Quantity</IonLabel>
              <IonInput
                ref={inputQuantity}
                // onIonChange={(e: any) => {
                //   setNewAssetQuant(e.detail.value);
                // }}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Currency</IonLabel>
              <IonInput
                // onIonChange={(e: any) => {
                //   setNewAssetCurrency(e.detail.value);
                // }}
                ref={inputCurrency}
              ></IonInput>
            </IonItem>
            <IonRow>
              <IonCol size="6">
                <IonButton
                  onClick={() => {
                    setShowAddModal(false);
                    console.log("the assertlist is ", assetList);
                  }}
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
                  onClick={() => onAssetSubmit("apple", 10, "CAD")}
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
    </IonPage>
  );
};

export default Main;
