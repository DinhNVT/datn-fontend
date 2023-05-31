import "./App.scss";
import AppRouter from "./routes/Route";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkRefreshTokenFetch } from "./stores/apiAuthRequest";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth?.login);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (user && !isFetched) {
      checkRefreshTokenFetch(dispatch);
      setIsFetched(true);
    }
  }, [dispatch, isFetched, user]);
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
