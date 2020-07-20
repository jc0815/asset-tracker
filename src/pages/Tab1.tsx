import React from "react";
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
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";
import { settingsOutline, addCircleOutline } from "ionicons/icons";
const Tab1: React.FC = () => {
  var assetList = [
    {
    "Name": "Asset1",
    "Quantity": "100",
    "Currency": "CAD"
    }
  ];
  if (document.URL.includes("?")) {
    const urlParams = document.URL.split("?")[1].split("&");
    const currentName = urlParams[0].split("=")[1];
    const currentQuantity = urlParams[1].split("=")[1];
    const currentCurrency = urlParams[2].split("=")[1].toUpperCase();
    var newAsset = {
      "Name": currentName,
      "Quantity": currentQuantity,
      "Currency": currentCurrency
    };
    assetList.push(newAsset);
  }
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonRow>
            <IonTitle>Virtual Wallet</IonTitle>
            <IonButton size="small" fill="solid">
              <IonIcon icon={settingsOutline}></IonIcon>
            </IonButton>
          </IonRow>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/*-- Default Item --*/}
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
        <IonItem>
          <IonGrid>
            {
              assetList.map(function(asset, index){
                return (
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
                );
              })
            }
            {/* <IonRow>
              <IonCol>
                <IonLabel>Assert1</IonLabel>
              </IonCol>
              <IonCol>
                <IonLabel>100</IonLabel>
              </IonCol>
              <IonCol>
                <IonLabel>CAD</IonLabel>
              </IonCol>
            </IonRow> */}
          </IonGrid>
        </IonItem>
        <IonItem>
          <IonButton size="small" fill="solid" href="/tab2">
            <IonIcon icon={addCircleOutline}></IonIcon>
          </IonButton>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
