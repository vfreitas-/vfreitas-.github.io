import React, { useEffect, useState } from "react"
import { isBrowser } from "../utils/server"

const rootEl = isBrowser() ? document.documentElement : null

function scrollTop () {
  rootEl.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const GoTop = () => {
  const [show, setShow] = useState(false)

  function handleScroll () {
    const scrollTotal = rootEl.scrollHeight - rootEl.clientHeight
  
    if ((rootEl.scrollTop / scrollTotal) > 0.5) {
      setShow(true)
    } else {
      setShow(false)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <button
      onClick={scrollTop}
      style={{
        position: "fixed",
        right: 16,
        bottom: 24,
        height: 48,
        width: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        borderRadius: "50%",
        color: "#fff",
        backgroundColor: "#0088ff",
        boxShadow: "1px 2px 3px 2px #403e3e40",
        transition: "transform .3s ease-out, opacity .2s ease-in",
        ...show ? {
          transform: "translateY(0)",
          opacity: 1,
        } : {
          transform: "translateY(100%)",
          opacity: 0,
        }
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M8 11h3v10h2V11h3l-4-4-4 4zM4 3v2h16V3H4z"/></svg>
    </button>
  )
}

export default GoTop
