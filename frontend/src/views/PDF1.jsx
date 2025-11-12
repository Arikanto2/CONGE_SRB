import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import logo from "../assets/logo2.jpg";
import logo3 from "../assets/logo3.jpg";
import FrenchNumbersToWords from "french-numbers-to-words";

const styles = StyleSheet.create({
  page: {
    paddingTop: 25,
    paddingBottom: 35,
    paddingLeft: 50,
    paddingRight: 50,
    fontFamily: "Times-Roman",
    fontSize: 12,
    lineHeight: 1.6,
  },
  headerTop: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerLogo: {
    height: 60,
    width: 200,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 60,
  },
  logoBlock: {
    alignItems: "center",
    textAlign: "center",
    fontSize: 11,
  },
  mainLogo: {
    height: 90,
    width: 100,
    marginBottom: 8,
  },
  textRight: {
    textAlign: "right",
    fontSize: 12,
    marginTop: 200,
  },
  title: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 25,
  },
  section: {
    marginBottom: 15,
    textAlign: "justify",
  },
  bold: {
    fontWeight: "bold",
    textDecoration: "underline",
  },
  list: {
    marginLeft: 15,
    marginTop: 5,
  },
  listItem: {
    marginBottom: 4,
  },
  footerSign: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signBlock: {
    width: "45%",
    alignItems: "center",
    textAlign: "center",
  },
  textEnd: {
    textAlign: "right",
    marginTop: 20,
    marginBottom: 40,
    
  },
});

export default function PDF1({ user, nbJour, decision = [], conge }) {
  if (!user || !conge) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>Données manquantes pour générer le PDF</Text>
        </Page>
      </Document>
    );
  }

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("fr-FR") : "";

  const convertNumber = (num) => new FrenchNumbersToWords("fr").convert(num).fullText;

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.headerTop}>
          <Image src={logo3} style={styles.headerLogo} />
        </View>

        <View style={styles.headerContent}>
          <View style={styles.logoBlock}>
            <Image src={logo} style={styles.mainLogo} />
            <Text>MINISTÈRE DE L'ÉCONOMIE ET DES FINANCES</Text>
            <Text>SECRÉTARIAT GÉNÉRAL</Text>
            <Text>DIRECTION GÉNÉRALE DES FINANCES ET DES</Text>
            <Text>AFFAIRES GÉNÉRALES</Text>
            <Text>SERVICE RÉGIONAL DU BUDGET</Text>
            <Text>HAUTE MATSIATRA</Text>
          </View>
          <Text style={styles.textRight}>
            Fianarantsoa, le {new Date().toLocaleDateString("fr-FR")}
          </Text>
        </View>

        <Text style={styles.title}>DEMANDE DE JOUISSANCE DE CONGÉ</Text>

        <View style={styles.section}>
          <Text>
            Je soussigné {user.NOM?.toUpperCase() || ""} {user.PRENOM || ""} IM {user.IM}, en
            service au {user.DIVISION}. Budget : GENERAL / Fonctionnement – Imputation budgétaire :
            00.210.114/3.00.23.2.260.30101.6012. Sollicite de jouissance d’une fraction de congé
            annuel de {convertNumber(nbJour)} ({nbJour || 0}) jours, au titre de l’année{" "}
            {new Date().getFullYear()} suivant décision{" "}
            {decision.length > 0
              ? decision.map((dec) => `n° ${dec.id} de l'année ${dec.an}`).join(", ")
              : "à définir"}
            . Et pour compter du {formatDate(conge.DATEDEBUT)} au {formatDate(conge.DATEFIN)}. Pour
            motif : {conge.TYPE || conge.CATEGORIE || ""}. Pour en jouir à : {conge.LIEU || ""}.
          </Text>
        </View>

        <View style={styles.textEnd}>
          <Text>L’intéressé(e)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>DÉCOMPTE</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • Reliquat : {convertNumber(decision.length > 0 ? decision[0].soldeApres : 0)} (
              {decision.length > 0 ? decision[0].soldeApres : 0}) jours
            </Text>
            <Text style={styles.listItem}>
              • Nombre de jours demandés : {convertNumber(nbJour)} ({nbJour || 0}) jours
            </Text>
            <Text style={styles.listItem}>
              • Droit de congé restant :{" "}
              {convertNumber(decision.length > 0 ? decision[0].soldeApres - nbJour : 0)} (
              {decision.length > 0 ? decision[0].soldeApres - nbJour : 0}) jours
            </Text>
          </View>
        </View>

        <View style={styles.footerSign}>
          <View style={styles.signBlock}>
            <Text style={{ marginBottom: 5 }}>
              {conge.VALIDDIV === "Validé" ? "AVIS FAVORABLE" : "AVIS DÉFAVORABLE"}
            </Text>
            <Text>Le Chef hiérarchique</Text>
          </View>
          <View style={styles.signBlock}>
            <Text style={{ marginBottom: 5 }}>
              {conge.VALIDCHEF === "Validé" ? "AVIS FAVORABLE" : "AVIS DÉFAVORABLE"}
            </Text>
            <Text>Le Chef du Service Régional du Budget</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
