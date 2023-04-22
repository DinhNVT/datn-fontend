import "./App.scss";
import AppRouter from "./routes/Route";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkRefreshTokenFetch } from "./stores/apiAuthRequest";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    checkRefreshTokenFetch(dispatch);
  }, [dispatch]);
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
