import React, { useEffect, useState } from "react";

const Analytics = () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const appsresponse = await fetch(
      "http://go-dev.greedygame.com/v3/dummy/apps",
      {
        method: "GET",
      }
    );
    const appsdata = await appsresponse.json();
    const appList = appsdata.data.reduce((appList, obj) => {
      appList[obj.app_id] = obj.app_name;
      return appList;
    }, {});

    const response = await fetch(
      "http://go-dev.greedygame.com/v3/dummy/report?startDate=2021-05-01&endDate=2021-05-03",
      {
        method: "GET",
      }
    );
    const data = await response.json();
    const dataListarray = data.data.map((item) => {
      return {
        Date: item.date.slice(0, 10),
        App: appList[item.app_id],
        Requests: item.requests,
        responses: item.responses,
        impressions: item.impressions,
        Clicks: item.clicks,
        Revenue: item.revenue,
        FilRate: (item.requests / item.responses) * 100,
        CTR: (item.clicks / item.impressions) * 100,
      };
    });
    setDataList(dataListarray);
  }

  let columns;
  if (dataList.length > 1) {
    columns = Object.keys(dataList[0]);
  }

  return (
    <div className="flex">
      <div className="h-screen w-20 bg-[#192F48]"></div>
      <div className="p-5 flex-1">
        <div className="mt-10">
          <h1 className="text-2xl font-semibold ">Analytics</h1>
          <form className="flex mt-4 justify-between">
            <input type="date" className="border rounded" />
            <button className="border px-2">Settings</button>
          </form>
          <div className="mt-2 border rounded">
            <div className="p-3">
              <h3 className="font-semibold">Dimensions and Metrics</h3>
              <div className="flex gap-3 mt-3">
                <div className="border rounded p-1 w-[110px]">Date</div>
                <div className="border rounded p-1 w-[110px]">App</div>
                <div className="border rounded p-1 w-[110px]">Clicks</div>
                <div className="border rounded p-1 w-[110px]">Ad Request</div>
                <div className="border rounded p-1 w-[110px]">Ad Response</div>
                <div className="border rounded p-1 w-[110px]">Impression</div>
                <div className="border rounded p-1 w-[110px]">Revenue</div>
                <div className="border rounded p-1 w-[110px]">Fill Rate</div>
                <div className="border rounded p-1 w-[110px]">CTR</div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button className=" text-blue-600  py-2 px-4 rounded border">
                  Close
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2">
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
          {dataList.length > 1 ? (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs">
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index} className="px-6 py-3">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataList.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border">
                      {columns.map((column, columnIndex) => (
                        <td key={columnIndex} className="px-6 py-4">
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <h3>No data to Show</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
