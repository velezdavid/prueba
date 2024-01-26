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
      <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-12 lg:!mb-0">
          <Banner tutorado={tutorado} />
        </div>

        <div className="col-span-12 lg:!mb-0">
          <MyMap />
        </div>
      </div>

      {/* all project & ... */}
      <AdvancedDatatableActividades actividades={tutorado?.actividades} />
      {/* <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <ColumnsTable
          columnsData={columnsDataColumns}
          tableData={tableDataColumns}
        />
      </div> */}
    </div>
  );
};

export default ProfileOverview;
