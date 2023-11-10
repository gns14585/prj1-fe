import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // /edit/:id
  const { id } = useParams();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  if (board == null) {
    return <Spinner />;
  }

  function handleTitleChange(e) {
    updateBoard((draft) => {
      draft.title = e.target.value;
    });
  }

  function handleSubmit() {
    onOpen();
    // 모달창에서 저장 버튼 클릭 시
    // put /api/board/edit

    axios
      .put("/api/board/edit", board)
      .then(() => {
        toast({
          description: "수정 되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        toast({
          description: error.response.data.message,
          status: "error",
        });
      })
      .finally(() => onClose(onClose));
  }

  return (
    <Box>
      <h1>{id}번 글 수정</h1>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          borderColor={board.title == "" ? "red" : "blue"}
          value={board.title}
          onChange={handleTitleChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel>본문</FormLabel>
        <Textarea
          borderColor={board.content == "" ? "red" : "blue"}
          value={board.content}
          onChange={(e) => {
            updateBoard((draft) => {
              draft.content = e.target.value;
            });
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input
          borderColor={board.writer == "" ? "red" : "blue"}
          value={board.writer}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.writer = e.target.value;
            })
          }
        />
      </FormControl>

      {/* 모달창을 열기 */}
      <Button onClick={onOpen} colorScheme="blue">
        저장
      </Button>
      {/* 이전 경로는 navigate(-1) , 이전이전은 -2 */}
      <Button onClick={() => navigate(-1)}>취소</Button>

      {/* 수정 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>수정 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            {/* 모달창에 있는 수정버튼을 누르게 되면 해당 내용이 Update 되야하는 function */}
            <Button onClick={handleSubmit} colorScheme="red">
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
