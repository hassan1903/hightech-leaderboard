import * as React from "react"
import { render } from "@testing-library/react"
import App from "./App"

test("renders learn react link", () => {
  const { getByText } = render(<App />)
  expect(getByText(/Amazeing Evening/i)).toBeInTheDocument()
})