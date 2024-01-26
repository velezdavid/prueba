import PieChartCard from "views/admin/default/components/PieChartCard";
import { MdBarChart, MdDashboard } from "react-icons/md";
import Widget from "components/widget/Widget";
import TopCreatorTable from "../marketplace/components/TableTopCreators";
import AdvancedDatatable from "components/datatable";
import { useEffect, useState } from "react";
import { getTutorados } from "services/tutorado.service";
import { getInfoDashboard } from "services/activity.service";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "hooks/useLanguage";
import { idioma } from "utils/constants";

const pieChartOptions = {
  chart: {
    width: "100px",
  },
  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: false,
        },
      },
    },
  },

  tooltip: {
    enabled: true,
    theme: "dark",
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000",
    },
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [tutorados, setTutorados] = useState([]);
  const [infoDashboard, setInfoDashboard] = useState({
    topFive: [],
    totalCategorias: 0,
    totalTutorados: 0,
    totalActividades: 0,
    dataGrafico: {},
  });
  const [options, setOptions] = useState(pieChartOptions);
  const [refresh, setRefresh] = useState(false);
  const { language } = useLanguage();

  const { cardsHome, tableTop } = idioma[language];

  const tableColumnsTopCreators = [
    {
      Header: tableTop?.text1,
      accessor: "tutorado",
    },
    {
      Header: tableTop?.text2,
      accessor: "total_actividades",
    },
    {
      Header: tableTop?.text3,
      accessor: "detalle",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);

    const getData = async () => {
      const tutorados = await getTutorados();
      const infoDash = await getInfoDashboard();
      setInfoDashboard(infoDash);
      setTutorados(tutorados);
      const dataPie = {
        labels: infoDash.dataGrafico.tutorados,
        colors: infoDash.dataGrafico.colors,
        fill: { colors: infoDash.dataGrafico.colors },
      };
      setOptions({ ...options, ...dataPie });
    };

    getData();
  }, [refresh]);

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={cardsHome?.text1}
          subtitle={infoDashboard?.totalTutorados}
        />
        <Widget
          icon={<MdDashboard className="h-7 w-7" />}
          title={cardsHome?.text2}
          subtitle={infoDashboard?.totalCategorias}
        />
        <Widget
          icon={<MdBarChart className="h-6 w-6" />}
          title={cardsHome?.text3}
          subtitle={infoDashboard?.totalActividades}
        />
      </div>

      {/* Charts */}

      <div className="mt-5 mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Complex Table & Charts */}

        <TopCreatorTable
          extra="mb-5"
          tableData={infoDashboard?.topFive}
          columnsData={tableColumnsTopCreators}
        />
        <PieChartCard
          pieChartData={infoDashboard?.dataGrafico?.actividades || []}
          pieChartOptions={options}
        />
      </div>
      <AdvancedDatatable
        tutorados={tutorados}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default Dashboard;
