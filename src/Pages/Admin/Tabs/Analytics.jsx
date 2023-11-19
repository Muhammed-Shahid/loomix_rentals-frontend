import React, { useState } from "react";
import * as ReactDOM from "react-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useEffect } from "react";
import { Tabs, Dropdown, Menu } from "antd";
import primary_instance from "../../../Components/axios_primary_instance";
import { ExcelGenerator } from "../../../Components/ExcelGenerator";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "",
    },
  },
};

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const chartData = [100, 200, 300, 400, 500];
const chartData2 = [100, 200, 50, 400, 500];

function Analytics() {
  const [successfullOrders, setSuccessfullOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [revenue, setrevenue] = useState([])

  useEffect(() => {
    const params = {
      sales_report_period: 2023,
    };
    primary_instance.get("/manage_order/", { params: params }).then((res) => {
      console.log(res.data);
      setSuccessfullOrders(res.data.successfull_orders);
      setCancelledOrders(res.data.cancelled_orders);
      setrevenue(res.data.monthly_revenue)
    });
  }, []);

  let data = 0;
  useEffect(() => {
    console.log("orders: ");
    console.log(successfullOrders);
    console.log(cancelledOrders);
  }, [successfullOrders, cancelledOrders]);

  data = {
    labels,

    datasets: [
      {
        label: "Succesfull Orders",
        data: successfullOrders,

        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Cancelled Orders",
        data: cancelledOrders,

        borderColor: "rgb(255, 99, 132)",

        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  let revenue_data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: revenue,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      }
    ],
  };

  const makeMenu = (
    <Menu>
      <Menu.Item
      // onClick={(e) => handleInputChange("make", item)}
      // key={index}
      >
        2023
      </Menu.Item>
    </Menu>
  );
  const items = [
    {
      key: "1",
      label: "Sales Analytics",
      children: (
        <div>
          {" "}
          <h2> Sales Analytics</h2>
          <div className=" row year-selector gx-5 w-100">
            <div className="col " style={{ textAlign: "left" }}>
              <Dropdown
                overlay={makeMenu}
                trigger={["hover"]}
                placement="bottomLeft"
                style={{ width: "100px" }}
              >
                <div style={{ textAlign: "left" }}>
                  <h6>Select Year</h6>
                </div>
              </Dropdown>
            </div>

            <div className="col">
              <div>
                <ExcelGenerator />
              </div>
            </div>
          </div>
          {successfullOrders && <Bar options={options} data={data} />}{" "}
        </div>
      ),
    },
    {
      key: "2",
      label: "Revenue",
      children: (
        <div>
          {" "}
          <h2> Sales Analytics</h2>
          {successfullOrders && <Line data={revenue_data} />}{" "}
        </div>
      ),
    },
  ];

  const onTabChange = (key) => {
    console.log(key);
  };

  function handleExcel() {
    ReactDOM.render(<ExcelGenerator />, document.getElementById("root"));
  }
  return (
    <div className="p-3 mt-3">
      <Tabs
        tabPosition="left"
        defaultActiveKey="1"
        items={items}
        onChange={onTabChange}
      />
    </div>
  );
}

export default Analytics;
