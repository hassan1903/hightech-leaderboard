import * as React from "react"
import "./index.css"

interface MazePlayInfosTypes {
  name: string
  potentialReward: number
  obtainedReward: number
  durationMilliseconds: number
  hasBeenPlayed: boolean
}

export interface PlayerProgressType {
  mazePlayInfos: Array<MazePlayInfosTypes>
  playerId: string
  name: string
  currentMaze: string
  score: number
  scoreInHand: number
  scoreInBag: number
  eEgg: boolean
}

interface InvocationsType {
  playerId: string
  invocationsViaHTTP: number
  invocationsViaGRPC: number
}

export interface ItemsType {
  invocations: InvocationsType
  playerProgress: PlayerProgressType
  playerId: string
  hasBeenForgotten: boolean
}

interface PropsType {
  data: Array<ItemsType>
  style?: Object
  onRowClick: (item: ItemsType) => void
}

const DataTable = (props: PropsType) => {
  const columns = [
    { label: "#", value: "place" },
    { label: "Name", value: "name" },
    { label: "Score", value: "score" },
    { label: "Hand / Bag", value: "handbag" },
    { label: "Current Maze", value: "currentMaze" },
    { label: "HTTP / GRPC", value: "invocations" }
  ]

  const renderTableHead = () => {
    return (
      <thead>
        <tr>
          {columns.map(({ label, value }) => {
            return (
              <th data-label={value} key={value}>
                {label}
              </th>
            )
          })}
        </tr>
      </thead>
    )
  }

  const renderTableBody = (item: ItemsType, index: number) => {
    const { currentMaze, eEgg, name, playerId, score, scoreInHand, scoreInBag } =
      item?.playerProgress || {}
    const { invocationsViaHTTP, invocationsViaGRPC } = item?.invocations || {}
    return (
      <tr key={playerId ?? index} onClick={() => props.onRowClick(item)}>
        <td data-label="#">{index + 1}</td>
        <td data-label="Name">{`${name ?? "Unknown"} ${
          eEgg ? "🐣" : eEgg === undefined ? "👻" : "🥚"
        }`}</td>
        <td data-label="Score">{`💰 ${score ?? 0}`}</td>
        <td data-label="HandBag">
          <span>{`🖐 ${scoreInHand ?? 0}`}</span>
          <br />
          <span>{`🎒 ${scoreInBag ?? 0}`}</span>
        </td>
        <td data-label="CurrentMaze">{currentMaze ? currentMaze : "-"}</td>
        <td data-label="HTTPGRPC">{`${invocationsViaHTTP ?? 0} / ${invocationsViaGRPC ?? 0}`}</td>
      </tr>
    )
  }

  return (
    <div className="container" style={props.style}>
      <table>
        {renderTableHead()}
        <tbody>
          {props.data?.map((item: ItemsType, index: number) =>
            item ? renderTableBody(item, index) : null
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
