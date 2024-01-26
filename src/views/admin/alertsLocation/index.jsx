import PieChartCard from "../default/components/PieChartCard";
import TotalSpent from "../default/components/TotalSpent";
import tableDataColumns from "../tables/variables/tableDataColumns.json";
import { columnsDataColumns } from "../tables/variables/columnsData";
import ColumnsTable from "../tables/components/ColumnsTable";
import Banner from "./components/Banner";
import AdvancedDatatable from "components/datatable";
import MyMap from "components/map";
import { useEffect, useState } from "react";
import { getPerfilTutorado } from "services/tutorado.service";
import { useParams } from "react-router-dom";
import AdvancedDatatableActividades from "components/datatableActividades";
import AdvancedDatatableNotifications from "components/datatableAlertNotifications";

const ProfileOverview = () => {
  let { id } = useParams();

  const [tutorado, setTutorado] = useState({});
  useEffect(() => {
    window.scrollTo(0, 0);

    const getData = async (id) => {
      const tutorado = await getPerfilTutorado(id);
      setTutorado(tutorado);
    };
    getData(id);
  }, []);

  return (
    <div className="flex w-full flex-col gap-5">
      {/* all project & ... */}
      <AdvancedDatatableNotifications actividades={tutorado?.actividades} />
    </div>
  );
};

export default ProfileOverview;
