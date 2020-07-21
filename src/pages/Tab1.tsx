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
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";
import { settingsOutline, addCircleOutline, closeCircle } from "ionicons/icons";
const Tab1: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  var assetList = [
    {
      Name: "Asset1",
      Quantity: "100",
      Currency: "CAD",
    },
  ];
  if (document.URL.includes("?")) {
    const urlParams = document.URL.split("?")[1].split("&");
    const currentName = urlParams[0].split("=")[1];
    const currentQuantity = urlParams[1].split("=")[1];
    const currentCurrency = urlParams[2].split("=")[1].toUpperCase();
    var newAsset = {
      Name: currentName,
      Quantity: currentQuantity,
      Currency: currentCurrency,
    };
    assetList.push(newAsset);
  }

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
                  onClick={() => console.log("unread clicked")}
                  color="danger"
                >
                  Delete
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          );
        })}
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

        <IonModal isOpen={showAddModal} cssClass="addModal">
          <IonList lines="full">
            <IonItem>
              <IonLabel position="floating">Name</IonLabel>
              {/* the floating will float the label */}
              <IonInput></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Quantity</IonLabel>
              <IonInput></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Currency</IonLabel>
              <IonInput></IonInput>
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
                  href="/tab1?name=hi&quantity=100&currency=cad"
                >
                  Add
                </IonButton>
              </IonCol>
            </IonRow>
          </IonList>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
