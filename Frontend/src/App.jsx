import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./dashboard/templates/Layout";
import CargaConfig from "./dashboard/components/CargaConfig";
import CargaTransacciones from "./dashboard/components/CargaTransacciones";
import Consultas from "./dashboard/components/Consultas";
import Graficas from "./dashboard/components/Graficas";
import Ayuda from "./dashboard/components/Ayuda";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CargaConfig />} />
          <Route path="CargarTransacciones" element={<CargaTransacciones />} />
          <Route path="Consultas" element={<Consultas />} />
          <Route path="Graficas" element={<Graficas />} />
          <Route path="Ayuda" element={<Ayuda />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App;