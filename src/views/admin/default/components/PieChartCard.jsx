import PieChart from "components/charts/PieChart";
import Card from "components/card";
import { useLanguage } from "hooks/useLanguage";
import { idioma } from "utils/constants";

const PieChartCard = ({ pieChartData, pieChartOptions }) => {
  const { language } = useLanguage();
  const { cardsHome } = idioma[language];

  return (
    <Card extra="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            {cardsHome?.text5}
          </h4>
        </div>

        <div className="invisible mb-6 flex items-center justify-center">
          <select className="mb-3 mr-2 flex items-center justify-center text-sm font-bold text-gray-600 hover:cursor-pointer dark:!bg-navy-800 dark:text-white">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>
      <div className="mb-auto flex h-[220px] w-full items-center justify-center ">
        <PieChart options={pieChartOptions} series={pieChartData} />
      </div>
      <div className="flex flex-row !justify-between rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-cyan-700" />
            <p className="ml-1 text-sm font-normal text-gray-600">
              {cardsHome?.text6}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PieChartCard;
