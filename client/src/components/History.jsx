import styled from "styled-components";
import { getResults } from "../utils/api";
import { useEffect, useState } from "react";
import Table from "./styled/Table";

const History = () => {
  const [lists, setLists] = useState([]);

  const fetchGameRecords = async () => {
    const result = await getResults();

    setLists(result.data);
  };

  useEffect(() => {
    fetchGameRecords();
  }, []);

  return (
    <Container>
      <h2>History</h2>

      <Table border={1} cellSpacing={0}>
        <thead>
          <tr>
            <td>Room</td>
            <td>Player</td>
            <td>Wins</td>
            <td>Loses</td>
            <td>Draw</td>
          </tr>
        </thead>
        <tbody>
          {lists.map((item) => {
            return (
              <tr>
                <td>{item.roomId}</td>
                <td>{item.playerName}</td>
                <td>{item.winCount}</td>
                <td>{item.loseCount}</td>
                <td>{item.drawCount}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

const Container = styled.div``;

export default History;
