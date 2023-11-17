import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatIcon } from "@chakra-ui/icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [params] = useSearchParams();

  console.log(params.toString());

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/list?" + params)
      .then((response) => setBoardList(response.data));
  }, [params]); // 경로가 바뀔때마다 해당 데이터를 다시 가져옴

  if (boardList === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>게시물 목록</h1>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>
                <FontAwesomeIcon icon={fullHeart} />
              </Th>
              <Th>title</Th>
              <Th>by</Th>
              <Th>at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList.map((board) => (
              <Tr
                _hover={{
                  cursor: "pointer",
                }}
                key={board.id}
                onClick={() => navigate("/board/" + board.id)}
              >
                <Td>{board.id}</Td>
                <Td>{board.countLike != 0 && board.countLike}</Td>
                <Td>
                  {board.title}
                  {board.countComment > 0 && (
                    <Badge>
                      <ChatIcon />
                      {board.countComment}
                    </Badge>
                  )}
                </Td>
                <Td>{board.nickName}</Td>
                <Td>{board.ago}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Box>
        <Button onClick={() => navigate("/?p=1")}>1</Button>
        <Button onClick={() => navigate("/?p=2")}>2</Button>
        <Button onClick={() => navigate("/?p=3")}>3</Button>
        <Button onClick={() => navigate("/?p=4")}>4</Button>
        <Button onClick={() => navigate("/?p=5")}>5</Button>
        <Button onClick={() => navigate("/?p=6")}>6</Button>
        <Button onClick={() => navigate("/?p=7")}>7</Button>
        <Button onClick={() => navigate("/?p=8")}>8</Button>
        <Button onClick={() => navigate("/?p=9")}>9</Button>
        <Button onClick={() => navigate("/?p=10")}>10</Button>
      </Box>
    </Box>
  );
}
