import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import logo from "../assets/logo2.jpg";
import logo3 from "../assets/logo3.jpg";

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: "Times-Roman",
    fontSize: 13,
    lineHeight: 1.5,
  },
  headerLogo: {
    height: 60,
    width: 200,
    marginBottom: 24,
    alignSelf: "center",
  },
  mainLogo: {
    height: 90,
    width: 100,
    marginBottom: 10,
    alignSelf: "center",
  },
  demande: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 15,
    fontWeight: "bold",
  },

  section: {
    marginBottom: 10,
    fontSize: 11,
  },

  bold: {
    fontWeight: "bold",
  },
});

export default function PDF({ conge, nbrJR, validation, user }) {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("fr-FR");
    } catch {
      return "Date invalide";
    }
  };

  if (!conge || !user) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>Erreur : données manquantes pour générer le PDF</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page style={styles.page}>
        <Image src={logo3} style={styles.headerLogo} />

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 40 }}>
          <View style={styles.section}>
            <Image
              src={logo}
              style={{ height: 100, width: 115, marginBottom: 10, alignSelf: "center" }}
            />
            <View style={{ alignItems: "center" }}>
              <Text>MINISTÈRE DE L’ÉCONOMIE ET DES FINANCES</Text>
              <Text>SECRÉTARIAT GÉNÉRAL</Text>
              <Text>DIRECTION GÉNÉRALE DES FINANCES ET DES</Text>
              <Text>AFFAIRES GÉNÉRALES</Text>
              <Text>SERVICE RÉGIONAL DU BUDGET</Text>
              <Text>HAUTE MATSIATRA</Text>
            </View>
          </View>

          <Text style={{ textAlign: "right", marginTop: 210 }}>
            Fianarantsoa, le {new Date().toLocaleDateString("fr-FR")}
          </Text>
        </View>

        <Text style={styles.demande}>DEMANDE D’AUTORISATION D’ABSENCE</Text>

        <View style={styles.section}>
          <Text>n° 218564-MEF/SG/DGBF/DB/SRB-HAUTE MATSIATRA</Text>
          <Text>
            Nom et prénoms : {user.NOM?.toUpperCase() || ""} {user.PRENOM || ""}
          </Text>
          <Text>Fonction : {user.FONCTION || ""}</Text>
          <Text>Matricule : {user.IM || ""}</Text>
          <Text>Corps : {user.CORPS || ""}</Text>
          <Text>Grade : {user.GRADE || ""}</Text>
          <Text>Structure : MEF / SG / DGBF / DB / SRB – Haute Matsiatra</Text>
          <Text>Est autorisé(e) à s’absenter pour une durée de {nbrJR || 0} jours.</Text>
          <Text>
            À compter du {formatDate(conge.DATEDEBUT)} au {formatDate(conge.DATEFIN)}.
          </Text>
          <Text>Suppléant : {conge.INTERIM || ""}</Text>
          <Text>
            Motif : {conge.MOTIF} ({conge.CATEGORIE}
            {conge.ABSENCE ? " - demi-journée " + conge.ABSENCE : ""}).
          </Text>

          <Text>Lieu de jouissance : {conge.LIEU || ""}.</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 40 }}>
          <Text>L’intéressé(e)</Text>
          <View style={{ alignItems: "center" }}>
            <Text>Le chef hiérarchique</Text>
            <Text>{validation || "En attente"}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
