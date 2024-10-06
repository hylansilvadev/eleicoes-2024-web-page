import React, { useEffect, useState } from 'react';
import { ChakraProvider, Box, Heading, Select, Text, Flex, Table, Thead, Tbody, Tr, Th, Td, Image, Input, Button } from '@chakra-ui/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import TabelaCandidatos from './components/TabelaCandidatos';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const App = () => {
  const [selecao, setSelecao] = useState("Prefeitos");
  const [candidatos, setCandidatos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [ordenarPor, setOrdenarPor] = useState(null);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState({ dg: '', hg: '' });
  let socket;

  useEffect(() => {
    // Cria uma nova instância do WebSocket
    socket = new WebSocket("wss://apipaudalho2024-k1xp4xzb.b4a.run/ws");

    socket.onopen = () => {
      console.log("Conexão WebSocket aberta");
      if (selecao === "Prefeitos") {
        socket.send(JSON.stringify({ acao: "receber_prefeito" }));
      } else {
        socket.send(JSON.stringify({ acao: "receber_vereador" }));
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.carg) {
        const parsedData = data.carg.flatMap((cargo) =>
          cargo.agr.flatMap((agrupamento) =>
            agrupamento.par.flatMap((partido) =>
              partido.cand.map((candidato) => ({
                nomeUrna: candidato.nmu,
                siglaPartido: partido.sg,
                votosApurados: parseInt(candidato.vap, 10),
                percentualVotos: parseFloat(candidato.pvap.replace(",", ".")),
                partido: partido.nm,
                nome: candidato.nm,
                idCandidato: candidato.sqcand,
                imagemUrl: candidato.imagemUrl, // URL da imagem do candidato
              }))
            )
          )
        );
        setCandidatos(parsedData);
        setUltimaAtualizacao({ dg: data.dg, hg: data.hg });
      } else {
        console.warn("Nenhum dado encontrado ou estrutura inesperada", data);
      }
    };

    socket.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
    };

    socket.onclose = () => {
      console.log("Conexão WebSocket fechada");
    };

    return () => {
      socket.close();
    };
  }, [selecao]);

  const handleSelecaoChange = (event) => {
    setSelecao(event.target.value);
  };

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const handleOrdenarPor = (criterio) => {
    setOrdenarPor(criterio);
  };

  const candidatosFiltrados = candidatos
    .filter((candidato) =>
      candidato.nomeUrna.toLowerCase().includes(filtro.toLowerCase()) ||
      candidato.siglaPartido.toLowerCase().includes(filtro.toLowerCase())
    )
    .sort((a, b) => {
      if (!ordenarPor) return 0;
      if (ordenarPor === "votosApurados") {
        return b.votosApurados - a.votosApurados;
      } else if (ordenarPor === "percentualVotos") {
        return b.percentualVotos - a.percentualVotos;
      } else {
        return 0;
      }
    });

  return (
    <ChakraProvider>
      <Flex>
        <Box p={5}>
          <Heading mb={5}>Dashboard de Visualização de Dados dos Candidatos - Eleições Paudalho 2024</Heading>
          <Flex mb={5} alignItems="center">
            <Text mr={3}>Selecione a página:</Text>
            <Select value={selecao} onChange={handleSelecaoChange} width="200px">
              <option value="Prefeitos">Prefeitos</option>
              <option value="Vereadores">Vereadores</option>
            </Select>
          </Flex>
          <Flex>
            <Flex mb={5} alignItems="center">
              <Text mr={3}>Filtrar candidatos:</Text>
              <Input value={filtro} onChange={handleFiltroChange} placeholder="Digite o nome ou partido" width="300px" />
            </Flex>
            <Flex mb={5} alignItems="center" gap={3}>
              <Text mr={3}>Ordenar por:</Text>
              <Button onClick={() => handleOrdenarPor("votosApurados")}>Votos Apurados</Button>
              <Button onClick={() => handleOrdenarPor("percentualVotos")}>Percentual de Votos</Button>
            </Flex>
          </Flex>
            <Text mb={5} fontSize="sm" color="gray.600">
              Última atualização: {ultimaAtualizacao.dg} às {ultimaAtualizacao.hg}
            </Text>
          <Flex flexWrap="wrap" justifyContent="space-around" gap={5} mb={5}>
            <Box width={['100%', '48%']} p={5} boxShadow="md" borderRadius="md">
              <Heading as="h2" size="md" mb={3}>
                Votos Apurados por {selecao === "Prefeitos" ? "Prefeito" : "Vereador"}
              </Heading>
              <BarChart candidatos={candidatosFiltrados} selecao={selecao} options={{ plugins: { legend: { display: false } } }} />
            </Box>
            <Box width={['100%', '48%']} p={5} boxShadow="md" borderRadius="md">
              <Heading as="h2" size="md" mb={3}>
                Percentual de Votos por {selecao === "Prefeitos" ? "Prefeito" : "Vereador"}
              </Heading>
              <PieChart candidatos={candidatosFiltrados} selecao={selecao} />
            </Box>
          </Flex>
        </Box>
        <Box boxShadow="md" borderRadius="md" p={5} style={{ height: "90vh", overflowY: "scroll" }}>
          <Heading as="h2" size="md" mb={5}>Lista de Candidatos - {selecao}</Heading>
          <TabelaCandidatos candidatos={candidatosFiltrados} />
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default App;