export const sumVendedor = (index: number, acc: any, act: any) => {
  if (index !== -1) {
    const dataAtual = acc[index];
    const treatedTecnico = {
      valor: act.get("valor"),
    };

    dataAtual.valor = Number(dataAtual.valor) + Number(treatedTecnico.valor);

    acc[index] = dataAtual;
  } else {
    const treatedTecnico = {
      nome: act.get("idOs").get("idCliente").get("nome"),
      valor: act.get("valor"),
      dataItem: act.get("dataItem"),
      color: `${"hsl(" + 360 * Math.random() + "," + 50 + "%," + 50 + "%)"}`,
      empresa: act.empresa.get("razao"),
    };

    acc.push(treatedTecnico);
  }
};

export const sumVendas = (index: number, acc: any, act: any) => {
  if (index !== -1) {
    const dataAtual = acc[index];
    const treatedData = {
      valor: act.get("valor"),
    };

    dataAtual.valor = Number(dataAtual.valor) + Number(treatedData.valor);

    acc[index] = dataAtual;
  } else {
    const date = new Date(act.get("dataItem"));
    let month = date.toLocaleString("pt-BR", {
      timeZone: "UTC",
      month: "long",
    });

    const treatedData = {
      mes: month,
      valor: act.get("valor"),
      dataItem: act.get("dataItem"),
      color: `${"hsl(" + 360 * Math.random() + "," + 50 + "%," + 50 + "%)"}`,
    };

    acc.push(treatedData);
  }
};

export const treatVendedor = () => {};

export const treatVendas = () => {};
