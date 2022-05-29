import * as React from "react"
import "./App.css"
import DataTable, { ItemsType } from "./components/datatable"
import mockData from "./data/allData.json"

const App = () => {
  const [tableData, setTableData] = React.useState<any>(mockData)
  const [selectedRow, setSelectedRow] = React.useState<ItemsType | null>(null)
  const handleSort = (value: string, sortOrder: string) => {
    if (value && tableData) {
      const sorted = [...tableData].sort((a: any, b: any): number => {
        if (a?.playerProgress && b?.playerProgress) {
          let elemA = a?.playerProgress[value]
          let elemB = b?.playerProgress[value]
          return (
            elemA.toString().localeCompare(elemB.toString(), "en", {
              numeric: true
            }) * (sortOrder === "ascending" ? 1 : -1)
          )
        } else {
          return 0
        }
      })
      setTableData(sorted)
    }
  }
  React.useEffect(() => {
    handleSort("score", "descending")
  }, [])
  return (
    <div className="App">
      <div style={{ display: "flex", flexDirection: "row", padding: "20px", fontSize: "2em" }}>
        <span>A</span>
        <strong>maze</strong>
        <span>ing Evening</span>
      </div>
      <div style={{ width: "100%", maxWidth: "100%" }}>
        <DataTable
          data={tableData}
          onRowClick={(item: ItemsType) => {
            setSelectedRow(item)
          }}
        />
      </div>
    </div>
  )
}

export default App
