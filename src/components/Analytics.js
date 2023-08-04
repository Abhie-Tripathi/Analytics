import React, { useEffect, useState } from "react";

const Tag = ({ text, selected, disabled, onClick }) => {
  const tagClass = selected
    ? "border bg-blue-500 text-white rounded p-1 cursor-pointer"
    : "border rounded p-1 cursor-pointer";
  return (
    <div className={tagClass} onClick={disabled ? undefined : onClick}>
      {text}
    </div>
  );
};

const Analytics = () => {
  const [dataList, setDataList] = useState([]);
  const [date, setDate] = useState("2021-05-01");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTags, setSelectedTags] = useState(["Date", "App"]); // Date and App are initially selected and cannot be deselected
  const [appliedTags, setAppliedTags] = useState(["Date", "App"]); // Date and App are initially applied and disabled

  const applyChanges = () => {
    setShowSettings(false);
    setAppliedTags(selectedTags);
  };

  useEffect(() => {
    getData();
  }, [date]);

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
      `http://go-dev.greedygame.com/v3/dummy/report?startDate=${date}&endDate=${date}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    const dataListarray = data.data.map((item) => {
      return {
        Date: item.date.slice(0, 10),
        App: appList[item.app_id],
        Clicks: item.clicks,
        "Ad Request": item.requests,
        "Ad Response": item.responses,
        Impression: item.impressions,
        Revenue: item.revenue,
        "Fill Rate": (item.requests / item.responses) * 100,
        CTR: (item.clicks / item.impressions) * 100,
      };
    });
    setDataList(dataListarray);
  }

  const toggleTagSelection = (tag) => {
    // Check if the tag is "Date" or "App" (disabled tags)
    if (tag === "Date" || tag === "App") {
      return; // Skip selecting the disabled tags
    }

    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  const toggleSettings = (e) => {
    e.preventDefault();
    setShowSettings(!showSettings);
  };

  const allTags = [
    "Date",
    "App",
    "Clicks",
    "Ad Request",
    "Ad Response",
    "Impression",
    "Revenue",
    "Fill Rate",
    "CTR",
  ];

  let columns;
  if (dataList.length > 0) {
    columns = Object.keys(dataList[0]);
  }

  function dateSetter(e) {
    setDate(e.target.value);
  }

  return (
    <div className="flex">
      <div className="h-screen w-20 bg-[#192F48]"></div>
      <div className="p-5 flex-1">
        <div className="mt-10">
          <h1 className="text-2xl font-semibold ">Analytics</h1>
          <form className="flex mt-4 justify-between">
            <input
              type="date"
              onChange={(e) => dateSetter(e)}
              className="border rounded"
              min="2021-06-01"
              max="2021-06-30"
            />
            <button className="border px-2" onClick={(e) => toggleSettings(e)}>
              Settings
            </button>
          </form>
          {showSettings && (
            <div className="mt-2 border rounded">
              <div className="p-3">
                <h3 className="font-semibold">Dimensions and Metrics</h3>
                <div className="flex gap-3 mt-3">
                  {allTags.map((tag) => (
                    <Tag
                      key={tag}
                      text={tag}
                      selected={selectedTags.includes(tag)}
                      disabled={tag === "Date" || tag === "App"} // Disable "Date" and "App" tags
                      onClick={() => toggleTagSelection(tag)}
                    />
                  ))}
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <button className="text-blue-600 py-2 px-4 rounded border">
                    Close
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
                    onClick={applyChanges}
                  >
                    Apply Changes
                  </button>
                  </div>
              </div>
            </div>
          )}
          {dataList.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs">
                  <tr>
                    {columns.map((column, index) => {
                      if (appliedTags.includes(column)) {
                        return (
                          <th key={index} className="px-6 py-3">
                            {column}
                          </th>
                        );
                      } else {
                        return <th key={index} className="px-6 py-3"></th>;
                      }
                    })}
                  </tr>
                </thead>
                <tbody>
                  {dataList.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border">
                      {columns.map((column, columnIndex) => {
                        if (appliedTags.includes(column)) {
                          return (
                            <td key={columnIndex} className="px-6 py-4">
                              {row[column]}
                            </td>
                          );
                        } else {
                          return (
                            <td key={columnIndex} className="px-6 py-4"></td>
                          );
                        }
                      })}
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
