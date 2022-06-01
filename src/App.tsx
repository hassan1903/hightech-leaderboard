import axios from "axios"
import * as React from "react"
import "./App.css"
import DataTable, { ItemsType, PlayerProgressType } from "./components/datatable"

const App = () => {
  const [tableData, setTableData] = React.useState<Array<ItemsType> | null>(null)
  // const [selectedRow, setSelectedRow] = React.useState<ItemsType | null>(null)
  const handleSort = (
    value: keyof PlayerProgressType,
    sortOrder: string,
    data?: Array<ItemsType>
  ) => {
    const sortableData = data ? data : tableData
    if (value && sortableData) {
      const sorted = [...sortableData].sort((a: ItemsType, b: ItemsType): number => {
        if (a?.playerProgress && b?.playerProgress) {
          const elemA = a?.playerProgress[value]
          const elemB = b?.playerProgress[value]
          return (
            elemA.toString().localeCompare(elemB.toString(), "en", {
              numeric: true
            }) * (sortOrder === "ascending" ? 1 : -1)
          )
        } else {
          return -1
        }
      })
      setTableData(sorted)
    }
  }
  const openConnection = async () => {
    // @ts-ignore
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://maze.hightechict.nl/leaderboard/api/hubs/leaderboard") // Ensure same as BE
      // @ts-ignore
      .configureLogging(signalR.LogLevel.Information)
      .build()
    newConnection.onclose(() => connectToSignalR(newConnection))
    connectToSignalR(newConnection)
  }

  const connectToSignalR = (hubCx?: any) => {
    notifyElmSignalRIsDisconnected()
    hubCx
      .start()
      .then(() => {
        /* hubCx.stream("PlayerInvocationsStream").subscribe({
          next: notifyElmAboutPlayerInvocation
        })

        hubCx.stream("PlayerLeaderboardInfoStream").subscribe({
          next: notifyElmAboutPlayerUpdate
        })

        hubCx.stream("ForgottenPlayerStream").subscribe({
          next: notifyElmAboutPlayerForgotten
        }) */

        notifyElmSignalRIsConnected()
      })
      .catch((err: string) => {
        console.log("error: ", err)
        setTimeout(() => connectToSignalR(), 5000)
      })
  }

  /* const notifyElmAboutPlayerInvocation = (signalRMessage: ItemsType) => {
    console.log("notifyElmAboutPlayerInvocation: ", signalRMessage)
    // @ts-ignore
    app.ports.playerInvocations.send([
      signalRMessage.playerId,
      {
        http: signalRMessage.invocationsViaHTTP,
        gRPC: signalRMessage.invocationsViaGRPC
      }
    ])
  }

  const notifyElmAboutPlayerUpdate = (signalRMessage: ItemsType) => {
    console.log("notifyElmAboutPlayerUpdate: ", signalRMessage)
    // @ts-ignore
    app.ports.playerUpdated.send(signalRMessage)
  }

  const notifyElmAboutPlayerForgotten = (signalRMessage: ItemsType) => {
    console.log("notifyElmAboutPlayerForgotten: ", signalRMessage)
    // @ts-ignore
    app.ports.playerForgotten.send(signalRMessage.playerId)
  } */

  const notifyElmSignalRIsConnected = () => {
    console.log("notifyElmSignalRIsConnected")
  }

  const notifyElmSignalRIsDisconnected = () => {
    console.log("notifyElmSignalRIsDisconnected")
  }

  const fetchData = () => {
    axios.get(`https://maze.hightechict.nl/leaderboard/api/leaderboard/allData`).then((res) => {
      if (res?.data) {
        setTableData(res.data)
        handleSort("score", "descending", res.data)
      }
      openConnection()
    })
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="App">
      <div className="title">
        <span>A</span>
        <strong>maze</strong>
        <span>ing Evening</span>
      </div>
      <div className="tableContainer">
        <DataTable
          data={tableData}
          /* onRowClick={(item: ItemsType) => {
            setSelectedRow(item)
          }} */
        />
      </div>
      <div className="footerContainer">
        <span className="footerItem">{"1 Dig Down the coins"}</span>
        <span className="footerItem">{"2 Don't forget to collect"}</span>
        <span className="footerItem">{"3 Easy To Collect"}</span>
        <span className="footerItem">{"4 Easy deal"}</span>
        <span className="footerItem">{"5 Example Maze"}</span>
        <span className="footerItem">{"6 Exit"}</span>
        <span className="footerItem">{"7 Glasses"}</span>
        <span className="footerItem">{"8 Hello Maze"}</span>
        <span className="footerItem">{"9 Loops"}</span>
        <span className="footerItem">{"10 Needle"}</span>
        <span className="footerItem">{"11 PacMan"}</span>
        <span className="footerItem">{"12 Reverse"}</span>
        <span className="footerItem">{"13 Spiral Of Doom"}</span>
      </div>
    </div>
  )
}

export default App
