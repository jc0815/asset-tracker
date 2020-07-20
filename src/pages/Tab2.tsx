import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonCol,
  IonButton,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab2.css";

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
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
            <IonButton expand="block" color="success" href="/tab1?name=hi&quantity=100&currency=cad" >
              Add
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
