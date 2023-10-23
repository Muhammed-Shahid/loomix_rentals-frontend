import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "white",
    width: 300,
  },
  section: {
    width: 200,
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Document Component
export const MyDocument = (params) => {
  const order = params.order;
  console.log('pdf viewer order', order);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {order && <Text>Section {order.id} </Text>}
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
};
