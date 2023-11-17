import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Spinner,
  Table,
  Tbody,
  Td,
  Tfoot,
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
  const [page, setPage] = useState("");

  console.log(params.toString());

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/list?" + params)
      .then((response) => setBoardList(response.data));
  }, []);

  if (boardList === null) {
    return <Spinner />;
  }

  // 게시판리스트 페이징처리
  function handleButtonPage(pageNumber) {
    axios
      .get("/api/board/list?p=" + pageNumber)
      .then((response) => {
        setBoardList(response.data);
        setPage(pageNumber); // 페이지 업데이트
      })
      .catch((error) => console.log(error));
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

        {/* 게시판리스트 페이징처리 버튼을 10개 만드는게 아니라 배열로 생성해서 처리 */}
        {/* 배열로 만들게 되면 버튼 하나하나 다 onClick 넣어줘야함 */}
        <Flex justifyContent="space-between">
          {Array.from({ length: 10 }, (_, index) => (
            <Button key={index + 1} onClick={() => handleButtonPage(index + 1)}>
              {index + 1}
            </Button>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}
