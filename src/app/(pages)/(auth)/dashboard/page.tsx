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
import { toast } from "react-toastify";
import Image from "next/image";

import Logo from "#/public/img/logo.jpg";
import Button from "@/components/Button";

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

  const { isAuthenticated, router, signed, user } = useContext(AuthContext);

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
      const nome = vendedorInfo
        .get("idOs")
        .get("idCliente")
        .get("nome")
        .toLowerCase();
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
      }

      if (vendasFiltro.monthEnd !== "") {
        const filtroMonthEnd = moment(vendasFiltro.monthEnd);
        elementValid = elementValid && date.isSameOrBefore(filtroMonthEnd);
      }

      return elementValid;
    });

    setVendasInfoFiltrado(newVendasInfoFiltrado);
  };

  // useEffect para autenticação
  useEffect(() => {
    isAuthenticated();

    // if (!signed) {
    //   router.push("/login");
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getItemOs = async () => {
      if (user?.get("idEmpresa")?.id) {
        const queryItemOs = new Parse.Query("ItemOs");
        queryItemOs.include("idTecnico");
        queryItemOs.include("idOs");

        const ItensOs = await queryItemOs.find();

        const osQuery = new Parse.Query("Os");

        for (let i = 0; i < ItensOs.length; i++) {
          const itemOs = ItensOs[i];

          osQuery.equalTo("objectId", itemOs.get("idOs").id);
          osQuery.include("idCliente");
          osQuery.include("idEmpresa");

          const [os] = await osQuery.find();

          if (
            os.get("idEmpresa")?.id !== user?.get("idEmpresa")?.id ||
            os.get("idEmpresa")?.id !==
              os.get("idCliente")?.get("idEmpresa")?.id
          ) {
            ItensOs.splice(i, 1);
          }
        }

        setVendedorInfo(ItensOs);
        setVendedorInfoFiltrado(ItensOs);

        setVendasInfo(ItensOs);
        setVendasInfoFiltrado(ItensOs);
        toast.success("Dados recuperados com sucesso.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "light",
        });
      }
    };

    getItemOs();
  }, [user]);

  useEffect(() => {
    const vendedoresLabel: any[] = vendedorInfoFiltrado.reduce((acc, act) => {
      const indexCliente = acc.findIndex(
        (cliente: any) =>
          cliente.nome === act.get("idOs").get("idCliente").get("nome")
      );

      if (act.get("idOs").get("idCliente").get("nome")) {
        sumVendedor(indexCliente, acc, act);
      }

      return acc;
    }, []);

    setDataVendedor(vendedoresLabel);
  }, [vendedorInfoFiltrado]);

  useEffect(() => {
    const vendasLabel: any[] = vendasInfoFiltrado.reduce((acc, act) => {
      const date = new Date(act.get("dataItem"));

      let month = date.toLocaleString("pt-BR", {
        timeZone: "UTC",
        month: "long",
      });
      month = month.slice(0, 1).toUpperCase() + month.slice(1);

      const indexData = acc.findIndex((data: any) => {
        return data.mes.toLowerCase() === month.toLowerCase();
      });

      if (act.get("idOs")?.get("idCliente")?.get("nome")) {
        sumVendas(indexData, acc, act);
      }

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
          label: "Total Item",
          data: dataVendas.map((data) => data.valor),
          backgroundColor: dataVendas.map((data) => data.color),
        },
      ],
    };

    setChartVendas(data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVendas]);

  return (
    <div className="flex items-center w-full">
      <div className="w-60 h-60 ml-20 relative">
        <Image
          objectFit="contain"
          layout="fill"
          src={Logo}
          alt="Topografia logo"
        />
      </div>
      <div className="flex flex-col items-center justify-center py-3 w-full">
        <div className="flex justify-center w-[60%] h-full min-w-[500px]">
          <div className="w-[90%]">
            <p className="font-semibold text-2xl pb-2">Serviços por Cliente</p>
            <div className="flex items-center justify-center border-2 border-black rounded-lg h-[400px] w-full">
              {chartVendedor ? (
                <>
                  <Pie
                    data={chartVendedor}
                    options={{
                      plugins: {
                        legend: {
                          position: "right",
                        },
                      },
                    }}
                    width={"100%"}
                    height={"100%"}
                  />
                </>
              ) : (
                <span className="loading loading-spinner loading-md"></span>
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
              labelText="Cliente"
            />
          </div>
        </div>
        <div className="flex justify-center w-[60%] h-full min-w-[500px] pt-4">
          <div className="w-[90%]">
            <p className="font-semibold text-2xl pb-2">
              Ordens de Serviço por Período
            </p>
            <div className="flex items-center justify-center border-2 border-black rounded-lg h-[400px] w-full">
              {chartVendas ? (
                <Bar data={chartVendas} options={optionsVendas} />
              ) : (
                <span className="loading loading-spinner loading-md"></span>
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
    </div>
  );
};

export default Dashboard;
