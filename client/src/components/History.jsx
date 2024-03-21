import styled from "styled-components";
import { getResults } from "../utils/api";
import { Fragment, useEffect, useState } from "react";
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

      {lists.map((item) => {
        return (
          <Fragment>
            <h4>Room: {item._id}</h4>
            <Table border={1} cellSpacing={0}>
              <thead>
                <tr>
                  <td>Name</td>
                  <td>Wins</td>
                  <td>Loses</td>
                  <td>Draws</td>
                </tr>
              </thead>
              <tbody>
                {item.participants.map((participant) => {
                  return (
                    <tr>
                      <td>{participant.playerName}</td>
                      <td>{participant.winCount}</td>
                      <td>{participant.loseCount}</td>
                      <td>{participant.drawCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Fragment>
        );
      })}
    </Container>
  );
};

const Container = styled.div``;

export default History;
