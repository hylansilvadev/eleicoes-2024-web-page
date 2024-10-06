import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const TabelaCandidatos = ({ candidatos }) => {
  return (
    <Table variant="striped" colorScheme="green">
      <Thead>
        <Tr>
          <Th>Nome</Th>
          <Th>Partido</Th>
          <Th>Votos Apurados</Th>
          <Th>Percentual de Votos</Th>
        </Tr>
      </Thead>
      <Tbody>
        {candidatos.map((candidato) => (
          <Tr key={candidato.idCandidato}>
            <Td>{candidato.nomeUrna}</Td>
            <Td>{candidato.siglaPartido}</Td>
            <Td>{candidato.votosApurados}</Td>
            <Td>{candidato.percentualVotos}%</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default TabelaCandidatos;