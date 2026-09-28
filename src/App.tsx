import { observer } from "mobx-react-lite";
import { Navigate, Route, Routes } from "react-router";

import ChatPage from "src/pages/chat-page";
import MainPage from "src/pages/main-page";
import ProtectedRoute from "src/components/common/protected-route";

import phoneStore from "src/stores/phone-store";

import { AppRoutes } from "src/constants";

const App = observer(() => {
  return (
    <Routes>
      <Route path={AppRoutes.MAIN_PAGE} element={<MainPage />} />
      <Route
        path={AppRoutes.CHAT_PAGE}
        element={
          <ProtectedRoute isAuthenticated={!!phoneStore.chatId}>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate replace to={AppRoutes.MAIN_PAGE} />} />
    </Routes>
  );
});

export default App;
