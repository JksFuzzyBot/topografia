"use client";
import InputComponent from "@/components/Input";
import { useContext, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { sumVendas, sumVendedor } from "@/utils/dashboard";
import moment from "moment";
import AuthContext from "@/context/AuthContext";

const Parse = require("parse/dist/parse.min.js");

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const PARSE_APPLICATION_ID = process.env.NEXT_PUBLIC_Key_Application_ld;
  const PARSE_JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_Key_JS_Key;
  const PARSE_HOST_URL = process.env.NEXT_PUBLIC_Key_Parse_Server_Url;

  // Your Parse initialization configuration goes here
  Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
  Parse.serverURL = PARSE_HOST_URL;

  const [vendedorInfo, setVendedorInfo] = useState<any[]>([]);
  const [vendasInfo, setVendasInfo] = useState<any[]>([]);

  const [vendedorInfoFiltrado, setVendedorInfoFiltrado] = useState<any[]>([]);
  const [vendasInfoFiltrado, setVendasInfoFiltrado] = useState<any[]>([]);

  const [chartVendedor, setChartVendedor] = useState<any>();
  const [chartVendas, setChartVendas] = useState<any>();

  const [dataVendedor, setDataVendedor] = useState<any[]>([]);
  const [dataVendas, setDataVendas] = useState<any[]>([]);

  const [vendedorFiltro, setVendedorFiltro] = useState({
    monthStart: "",
    monthEnd: "",
    razao: "",
    nome: "",
  });
  const [vendasFiltro, setVendasFiltro] = useState({
    monthStart: "",
    monthEnd: "",
    razao: "",
    cliente: "",
  });

  const { isAuthenticated } = useContext(AuthContext);

  const optionsVendas = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
          },
        ],
      },
    },
  };

  const handleFiltroVendedor = () => {
    const newVendedorInfoFiltrado = vendedorInfo.filter((vendedorInfo) => {
      const filtroPeriodo = vendedorInfo.get("dataItem");
      const date = moment(filtroPeriodo);

      const razao = vendedorInfo.empresa.get("razao").toLowerCase();
      const nome = vendedorInfo.get("idTecnico").get("nome").toLowerCase();
      const filtroRazao = vendedorFiltro.razao.toLowerCase();
      const filtroNome = vendedorFiltro.nome.toLowerCase();

      let elementValid =
        razao.includes(filtroRazao) && nome.includes(filtroNome);

      if (vendedorFiltro.monthStart !== "") {
        const filtroMonthStart = moment(vendedorFiltro.monthStart);
        elementValid = elementValid && date.isSameOrAfter(filtroMonthStart);
      }

      if (vendedorFiltro.monthEnd !== "") {
        const filtroMonthEnd = moment(vendedorFiltro.monthEnd);
        elementValid = elementValid && date.isSameOrBefore(filtroMonthEnd);
      }

      return elementValid;
    });

    setVendedorInfoFiltrado(newVendedorInfoFiltrado);
  };

  const handleFiltroVendas = () => {
    const newVendasInfoFiltrado = vendasInfo.filter((vendaInfo) => {
      const filtroPeriodo = vendaInfo.get("dataItem");
      const date = moment(filtroPeriodo);

      const razao = vendaInfo.empresa.get("razao").toLowerCase();
      const cliente = vendaInfo
        .get("idOs")
        .get("idCliente")
        .get("nome")
        .toLowerCase();

      const filtroRazao = vendasFiltro.razao.toLowerCase();
      const filtroCliente = vendasFiltro.cliente.toLowerCase();

      let elementValid =
        razao.includes(filtroRazao) && cliente.includes(filtroCliente);

      if (vendasFiltro.monthStart !== "") {
        const filtroMonthStart = moment(vendasFiltro.monthStart);
        elementValid = elementValid && date.isSameOrAfter(filtroMonthStart);
        console.log(elementValid);
      }

      if (vendasFiltro.monthEnd !== "") {
        const filtroMonthEnd = moment(vendasFiltro.monthEnd);
        elementValid = elementValid && date.isSameOrBefore(filtroMonthEnd);
        console.log(elementValid);
      }

      return elementValid;
    });

    setVendasInfoFiltrado(newVendasInfoFiltrado);
  };

  // useEffect para autenticação
  useEffect(() => {
    isAuthenticated();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getItemOs = async () => {
      const queryItemOs = new Parse.Query("ItemOs");
      queryItemOs.include("idTecnico");
      queryItemOs.include("idOs");

      const ItensOs = await queryItemOs.find();

      const empresaArr: any[] = [];
      const clientArr: any[] = [];

      const osQuery = new Parse.Query("Os");
      for (let i = 0; i < ItensOs.length; i++) {
        const itemOs = ItensOs[i];

        const notInEmpresaArr = empresaArr.findIndex(
          (empresaArr) => empresaArr.id === itemOs.get("idEmpresa").id
        );
        const notInClienteArr = clientArr.findIndex(
          (cliente) => cliente.id === itemOs.get("idCliente").id
        );

        osQuery.equalTo("objectId", itemOs.get("idOs").id);
        osQuery.include("idCliente");
        osQuery.include("idEmpresa");

        const [os] = await osQuery.find();

        if (notInEmpresaArr) {
          itemOs.empresa = os.get("idEmpresa");
        } else {
          itemOs.empresa = empresaArr[notInEmpresaArr];
        }

        if (notInClienteArr) {
          itemOs.os = os.get("idOs");
        } else {
          itemOs.os = clientArr[notInClienteArr];
        }
      }

      setVendedorInfo(ItensOs);
      setVendedorInfoFiltrado(ItensOs);

      setVendasInfo(ItensOs);
      setVendasInfoFiltrado(ItensOs);
    };

    getItemOs();
  }, []);

  useEffect(() => {
    const vendedoresLabel: any[] = vendedorInfoFiltrado.reduce((acc, act) => {
      const indexTecnico = acc.findIndex(
        (tecnico: any) => tecnico.nome === act.get("idTecnico").get("nome")
      );

      sumVendedor(indexTecnico, acc, act);

      return acc;
    }, []);

    setDataVendedor(vendedoresLabel);
  }, [vendedorInfoFiltrado]);

  useEffect(() => {
    const vendasLabel: any[] = vendasInfoFiltrado.reduce((acc, act) => {
      const date = new Date(act.get("dataItem"));

      let month = date.toLocaleString("default", { month: "long" });
      // month = month.slice(0, 1).toUpperCase() + month.slice(1, 3);
      month = month.slice(0, 1).toUpperCase() + month.slice(1);

      const indexData = acc.findIndex(
        (data: any) => data.mes === month.toLowerCase()
      );

      sumVendas(indexData, acc, act);

      return acc;
    }, []);

    setDataVendas(vendasLabel);
  }, [vendasInfoFiltrado]);

  useEffect(() => {
    handleFiltroVendedor();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendedorFiltro]);

  useEffect(() => {
    handleFiltroVendas();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendasFiltro]);

  useEffect(() => {
    const data = {
      labels: dataVendedor.map((vendedor) => vendedor.nome),
      datasets: [
        {
          label: `Nº em vendas`,
          data: dataVendedor.map((vendedor) => vendedor.valor),
          backgroundColor: dataVendedor.map((vendedor) => vendedor.color),
        },
      ],
    };

    setChartVendedor(data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVendedor]);

  useEffect(() => {
    const labels = dataVendas.map((data) => data.mes);

    const data = {
      labels,
      datasets: [
        {
          label: "Valor",
          data: dataVendas.map((data) => data.valor),
          backgroundColor: dataVendas.map((data) => data.color),
        },
      ],
    };

    setChartVendas(data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVendas]);

  return (
    <>
      <div className="w-full pt-20 pb-20">
        <p className="mx-auto w-fit px-20 pb-2 border-b-2">logo da empresa</p>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex justify-center w-[45%] h-full min-w-[500px] px-8">
          <div className="w-[90%]">
            <p className="font-semibold text-2xl pb-2">
              Relatório de vendas por vendedor
            </p>
            <div className="flex items-center justify-center border-2 border-black rounded-lg h-[300px] w-full px-4 px-2">
              {chartVendedor && (
                <Pie
                  data={chartVendedor}
                  options={{ plugins: { legend: { position: "right" } } }}
                />
              )}
            </div>
          </div>
          <div className="w-[150px] ml-8 mt-4">
            <p className="font-semibold">Filtros</p>
            <InputComponent
              className=" bg-gray-200 p-1 focus:outline-gray-200"
              onChange={(e) => {
                setVendedorFiltro((prevState) => {
                  return { ...prevState, monthStart: e.target.value };
                });
              }}
              labelText="Período Inicio"
              type="date"
            />
            <InputComponent
              className=" bg-gray-200 p-1 focus:outline-gray-200"
              onChange={(e) => {
                setVendedorFiltro((prevState) => {
                  return { ...prevState, monthEnd: e.target.value };
                });
              }}
              labelText="Período Fim"
              type="date"
            />
            <InputComponent
              className=" bg-gray-200 p-1 focus:outline-gray-200"
              onChange={(e) => {
                setVendedorFiltro((prevState) => {
                  return { ...prevState, razao: e.target.value };
                });
              }}
              labelText="Empresa"
            />
            <InputComponent
              className=" bg-gray-200 p-1 focus:outline-gray-200"
              onChange={(e) => {
                setVendedorFiltro((prevState) => {
                  return { ...prevState, nome: e.target.value };
                });
              }}
              labelText="Vendedor"
            />
          </div>
        </div>
        <div className="flex justify-center w-[45%] h-full min-w-[500px] px-8">
          <div className="w-[90%]">
            <p className="font-semibold text-2xl pb-2">
              Relatório de vendas no ano
            </p>
            <div className="flex items-center border-2 border-black rounded-lg h-[300px] w-full px-4">
              {chartVendas && (
                <Bar data={chartVendas} options={optionsVendas} />
              )}
            </div>
          </div>
          <div className="w-[150px] ml-8 mt-4">
            <p className="font-semibold">Filtros</p>
            <InputComponent
              className=" bg-gray-200 p-1 focus:outline-gray-200"
              onChange={(e) => {
                setVendasFiltro((prevState) => {
                  return { ...prevState, monthStart: e.target.value };
                });
              }}
              labelText="Período Inicio"
              type="date"
            />
            <InputComponent
              className=" bg-gray-200 p-1 focus:outline-gray-200"
              onChange={(e) => {
                setVendasFiltro((prevState) => {
                  return { ...prevState, monthEnd: e.target.value };
                });
              }}
              labelText="Período Fim"
              type="date"
            />
            <InputComponent
              className=" bg-gray-200 p-1 focus:outline-gray-200"
              onChange={(e) => {
                setVendasFiltro((prevState) => {
                  return { ...prevState, razao: e.target.value };
                });
              }}
              labelText="Empresa"
            />
            <InputComponent
              className=" bg-gray-200 p-1 focus:outline-gray-200"
              onChange={(e) => {
                setVendasFiltro((prevState) => {
                  return { ...prevState, cliente: e.target.value };
                });
              }}
              labelText="Cliente"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
