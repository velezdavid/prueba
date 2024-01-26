import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";
import Widget from "components/widget/Widget";
import AdvancedDatatable from "components/datatable";

const Usuarios = () => {
  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Tutorados"}
          subtitle={"5"}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Prom. actividades mens."}
          subtitle={"120"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Categorias registradas"}
          subtitle={"30"}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Actividades actuales"}
          subtitle={"30"}
        />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 ">
        {/* Complex Table & Charts */}

        <AdvancedDatatable />
      </div>
    </div>
  );
};

export default Usuarios;
