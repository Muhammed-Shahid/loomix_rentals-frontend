import React,{useState,useEffect} from "react";
import { Button } from "antd";
import { utils, writeFile } from "xlsx";
import primary_instance from "./axios_primary_instance";

export const ExcelGenerator = (props) => {
  const [Orders, setOrders] = useState([]);
  const [Products, setProducts] = useState([]);

  useEffect(() => {
    primary_instance.get("/manage_order/").then((res) => {
      console.log(res.data);
      setOrders(res.data.orders);
      setProducts(res.data.products);
    });
  }, []);
  const data = [
    { firstName: "John", lastName: "Doe" },
    { firstName: "Jane", lastName: "Doe" },
  ];
  const exportData = () => {
    let wb = utils.book_new(),
      ws = utils.json_to_sheet(Orders);
    utils.book_append_sheet(wb, ws, "sales_report");
    writeFile(wb, "sales_report.xlsx");
  };

  return (
    <div className="App">
      <div></div>

      <Button onClick={exportData}>Export sales report </Button>
    </div>
  );
};
