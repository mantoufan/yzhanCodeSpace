import { useEffect } from "react";
import { useNavigate } from "./hooks";

export default function Navigate({to, state, replace, relative }) {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to, { state, replace, relative })
  })
  return null
}