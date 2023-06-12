import "./App.scss";
import AppRouter from "./routes/Route";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkRefreshTokenFetch } from "./stores/apiAuthRequest";
import { fetchFavoritePosts } from "./stores/apiPostRequest";
import { fetchFollowingsUser } from "./stores/apiUserRequest";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth?.login);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (user && !isFetched) {
      checkRefreshTokenFetch(dispatch);
      setIsFetched(true);
    }
    // eslint-disable-next-line
  }, [isFetched, user]);

  useEffect(() => {
    fetchFavoritePosts(dispatch);
    fetchFollowingsUser(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
