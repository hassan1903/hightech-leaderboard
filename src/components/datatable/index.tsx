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

export interface InvocationsType {
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
  data: Array<ItemsType> | null
  playerId: string | null
  style?: Object
  onRowClick?: (item: ItemsType) => void
}

const DataTable = (props: PropsType) => {
  const columns = [
    { label: "#", value: "place" },
    { label: "Name", value: "name" },
    { label: "Score", value: "score" },
    { label: "Hand / Bag", value: "handbag" },
    { label: "Current Maze", value: "currentMaze" },
    { label: "1", value: "digDown" },
    { label: "2", value: "dontForget" },
    { label: "3", value: "easyToCollect" },
    { label: "4", value: "easyDeal" },
    { label: "5", value: "exampleMaze" },
    { label: "6", value: "exit" },
    { label: "7", value: "glasses" },
    { label: "8", value: "helloMaze" },
    { label: "9", value: "loops" },
    { label: "10", value: "needle" },
    { label: "11", value: "pacman" },
    { label: "12", value: "reverse" },
    { label: "13", value: "spiralOfDoom" },
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

  const renderEmptyMazeInfos = () => {
    const renderCol = []
    for (let index = 0; index < 13; index++) {
      renderCol.push(
        <td key={`maze_${index}`}>
          <div className="progressContainer" />
        </td>
      )
    }
    return renderCol
  }

  const renderTableBody = (item: ItemsType, index: number) => {
    const { currentMaze, eEgg, mazePlayInfos, name, playerId, score, scoreInHand, scoreInBag } =
      item?.playerProgress || {}
    const sortedMazePlayInfos = mazePlayInfos?.sort(
      (a: MazePlayInfosTypes, b: MazePlayInfosTypes) => {
        const elemA = a.name.toLowerCase()
        const elemB = b.name.toLowerCase()
        return elemA.toString().localeCompare(elemB.toString(), "en", {
          numeric: true
        })
      }
    )
    const { invocationsViaHTTP, invocationsViaGRPC } = item?.invocations || {}
    return (
      <tr key={playerId ?? index} onClick={() => props.onRowClick && props.onRowClick(item)}>
        <td data-label="#">{index + 1}</td>
        <td data-label="Name">{`${name ?? "Unknown"} ${
          eEgg ? "🐣" : eEgg === undefined ? "👻" : "🥚"
        }`}</td>
        <td data-label="Score">{`💰 ${score ?? 0}`}</td>
        <td data-label="Hand / Bag">
          <span>{`🖐 ${scoreInHand ?? 0}`}</span>
          <br />
          <span>{`🎒 ${scoreInBag ?? 0}`}</span>
        </td>
        <td data-label="Current Maze">{currentMaze ? currentMaze : "-"}</td>
        {sortedMazePlayInfos
          ? sortedMazePlayInfos.map(
              ({ hasBeenPlayed, name, obtainedReward, potentialReward }, index) => {
                const isCurrent =
                  props.playerId === playerId &&
                  (scoreInHand || scoreInBag) &&
                  currentMaze === name &&
                  !hasBeenPlayed
                const progress = isCurrent
                  ? ((scoreInHand || scoreInBag) * 100) / potentialReward
                  : obtainedReward
                  ? (potentialReward * 100) / obtainedReward
                  : 0
                return (
                  <td key={`maze_${index}`} data-label={index + 1}>
                    <div className="progressContainer">
                      {isCurrent && progress < 100 ? (
                        <div
                          style={{
                            height: `${100 - progress}%`,
                            backgroundColor: "transparent"
                          }}
                        />
                      ) : null}
                      <div
                        style={{
                          height: `${progress}%`,
                          backgroundColor: isCurrent ? "rgba(0,128,204,1)" : "rgba(0,179,51,1)"
                        }}
                      />
                    </div>
                  </td>
                )
              }
            )
          : renderEmptyMazeInfos()}
        <td data-label="HTTP / GRPC">{`${invocationsViaHTTP ?? 0} / ${
          invocationsViaGRPC ?? 0
        }`}</td>
      </tr>
    )
  }

  const renderBody = React.useCallback(() => {
    return props.data?.map((item: ItemsType, index: number) =>
      item ? renderTableBody(item, index) : null
    )
  }, [props?.data])

  return (
    <div className="container" style={props.style}>
      <table>
        {renderTableHead()}
        <tbody>{renderBody()}</tbody>
      </table>
    </div>
  )
}

export default DataTable
