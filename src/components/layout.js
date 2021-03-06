import React from "react"
import { Link } from "gatsby"

import { rhythm } from "../utils/typography"
import GoTop from "./gotop"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          fontSize: '3rem',
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h3>
    )
  }
  return (
    <div
      style={{
        display: `flex`,
        flexDirection: 'column',
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: 900,
        minHeight: '100vh',
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <footer style={{ marginTop: 'auto' }}>
        © {new Date().getFullYear()}, vfreitas.com.br
      </footer>
      <GoTop />
    </div>
  )
}

export default Layout
