import React, { useState } from "react";
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
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Main.css";
import { settingsOutline, addCircleOutline, closeCircle } from "ionicons/icons";
const Tab1: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const exampleAsset = {
    Name: "Example1",
    Quantity: "100",
    Currency: "CAD",
  };

  const [assetList, setAssetList] = useState([exampleAsset]);

  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetQuant, setNewAssetQuant] = useState("");
  const [newAssetCurrency, setNewAssetCurrency] = useState("");

  const onAssetSubmit = () => {
    const newAsset = {
      Name: newAssetName,
      Quantity: newAssetQuant,
      Currency: newAssetCurrency.toUpperCase(),
    };
    setAssetList((assetList) => [...assetList, newAsset]);
    setShowAddModal(false);
  };

  const deleteAsset = (asset: any) => {
    setAssetList(assetList.filter((item) => item["Name"] !== asset["Name"]));
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
            <IonItemSliding>
              <IonItem>
                <IonGrid>
                  <IonRow key={index}>
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
                onIonChange={(e: any) => {
                  setNewAssetQuant(e.detail.value);
                }}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Currency</IonLabel>
              <IonInput
                onIonChange={(e: any) => {
                  setNewAssetCurrency(e.detail.value);
                }}
              ></IonInput>
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
    </IonPage>
  );
};

export default Tab1;
