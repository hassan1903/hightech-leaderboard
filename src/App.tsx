import axios from "axios"
import * as React from "react"
import "./App.css"
import DataTable, { InvocationsType, ItemsType, PlayerProgressType } from "./components/datatable"

const App = () => {
  const [tableData, setTableData] = React.useState<Array<ItemsType> | null>(null)
  const [playerId, setPlayerId] = React.useState<string | null>(null)
  const [isInitialRender, setIsInitialRender] = React.useState(true)
  const [connectStatus, setConnectStatus] = React.useState("Disconnected")
  const handleSort = (
    value: keyof PlayerProgressType,
    sortOrder: string,
    data?: Array<ItemsType>
  ) => {
    const sortableData = data ? data : tableData
    if (value && sortableData) {
      const sorted = [...sortableData].sort((a: ItemsType, b: ItemsType): number => {
        let elemA, elemB
        if (a?.playerProgress) {
          elemA = a?.playerProgress[value]
        } else {
          elemA = 0
        }
        if (b?.playerProgress) {
          elemB = b?.playerProgress[value]
        } else {
          elemB = 0
        }
        return (
          elemA.toString().localeCompare(elemB.toString(), "en", {
            numeric: true
          }) * (sortOrder === "ascending" ? 1 : -1)
        )
      })
      console.log("sorted", sorted)
      setTableData(sorted)
    }
  }
  const openConnection = async () => {
    // @ts-ignore
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://maze.hightechict.nl/leaderboard/api/hubs/leaderboard")
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
        hubCx.stream("PlayerInvocationsStream").subscribe({
          next: notifyElmAboutPlayerInvocation
        })

        hubCx.stream("PlayerLeaderboardInfoStream").subscribe({
          next: notifyElmAboutPlayerUpdate
        })

        hubCx.stream("ForgottenPlayerStream").subscribe({
          next: notifyElmAboutPlayerForgotten
        })

        notifyElmSignalRIsConnected()
      })
      .catch((err: string) => {
        console.log("error: ", err)
        setTimeout(() => connectToSignalR(), 5000)
      })
  }

  const notifyElmAboutPlayerInvocation = (signalRMessage: InvocationsType) => {
    if (tableData) {
      const playerInd = tableData?.findIndex((el) => el.playerId === signalRMessage.playerId)
      const newData = [...tableData]
      if (playerInd >= 0) {
        newData[playerInd].invocations = signalRMessage
        setTableData(newData)
        setPlayerId(signalRMessage.playerId)
      }
    }
  }

  const notifyElmAboutPlayerUpdate = (signalRMessage: PlayerProgressType) => {
    if (tableData) {
      const playerInd = tableData?.findIndex((el) => el.playerId === signalRMessage.playerId)
      const newData = [...tableData]
      if (playerInd >= 0) {
        newData[playerInd].playerProgress = signalRMessage
        handleSort("score", "descending", newData)
      }
    }
  }

  const notifyElmAboutPlayerForgotten = (signalRMessage: ItemsType) => {
    console.log("notifyElmAboutPlayerForgotten: ", signalRMessage)
    if (tableData) {
      const playerInd = tableData?.findIndex((el) => el.playerId === signalRMessage.playerId)
      const newData = [...tableData]
      if (playerInd >= 0) {
        newData[playerInd].hasBeenForgotten = true
        setTableData(newData)
      }
    }
  }

  const notifyElmSignalRIsConnected = () => {
    console.log("notifyElmSignalRIsConnected")
    setConnectStatus("Connected")
  }

  const notifyElmSignalRIsDisconnected = () => {
    console.log("notifyElmSignalRIsDisconnected")
    setConnectStatus("Disconnected")
  }

  const fetchData = React.useCallback(() => {
    if (!tableData) {
      axios.get(`https://maze.hightechict.nl/leaderboard/api/leaderboard/allData`).then((res) => {
        if (res?.data) {
          setTableData(res.data)
          handleSort("score", "descending", res.data)
        }
      })
    } else {
      if (isInitialRender) {
        openConnection()
        setIsInitialRender(false)
      }
    }
  }, [tableData, isInitialRender])

  React.useEffect(() => {
    fetchData()
  }, [tableData])

  return (
    <div className="App">
      <div className="title">
        <div>
          <span>A</span>
          <strong>maze</strong>
          <span>ing Evening</span>
        </div>
        <div>
          <span>{`Status: ${connectStatus}`}</span>
        </div>
      </div>
      <div className="tableContainer">
        <DataTable data={tableData} playerId={playerId} />
      </div>
      <div className="footerContainer">
        <span className="footerItem">{"1 Dig Down the coins"}</span>
        <span className="footerItem">{"2 Don't forget to collect"}</span>
        <span className="footerItem">{"3 Easy deal"}</span>
        <span className="footerItem">{"4 Easy To Collect"}</span>
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
