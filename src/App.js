import { Routes, Route } from "react-router-dom";

import { DashLayout, Layout, Public } from "./components";
import { Login, PersistLogin, Prefetch, RequireAuth, Welcome } from "./features/auth";
import { EditUser, NewUserForm, UsersList } from "./features/users";
import { EditNote, NewNote, NotesList } from "./features/notes";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";

function App() {
  useTitle('Alex A. Repairs')

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              
              {/* Dash */}
              <Route path="dash" element={<DashLayout />}>

                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>

              </Route>
              {/* End Dash */}

            </Route>
          </Route>
        </Route>
        {/* End Protected Routes */}
      
      </Route>
    </Routes>
  );
}

export default App;
