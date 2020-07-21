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
import { settingsOutline, addCircleOutline, closeCircle } from "ionicons/icons";
const Tab1: React.FC = () => {
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
        <IonItem>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonLabel>Assert1</IonLabel>
              </IonCol>
              <IonCol>
                <IonLabel>2</IonLabel>
              </IonCol>
              <IonCol>
                <IonLabel>cad 100</IonLabel>
                <IonIcon slot="end" icon={closeCircle}></IonIcon>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>

        <IonButton expand="block" color="warning">
          <IonIcon icon={addCircleOutline}></IonIcon>
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
