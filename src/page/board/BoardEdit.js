import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
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
  const [uploadFiles, setUploadFiles] = useState(null);

  const navigate = useNavigate();

  // /edit/:id
  const { id } = useParams();

  const toast = useToast();

  const { isOpen, onClose, onOpen } = useDisclosure();

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
    // 저장 버튼 클릭 시
    // put /api/board/edit

    axios
      .putForm("/api/board/edit", { board, uploadFiles })
      .then(() => {
        toast({
          description: board.id + "번 게시글이 수정 되었습니다.",
          status: "success",
        });

        navigate("/board/" + id);
      })
      .catch((error) => {
        if (error.response.status == 400) {
          toast({
            description: "요청이 잘못되었습니다.",
            status: "error",
          });
        } else {
          toast({
            description: "수정 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => onClose());
  }

  return (
    <Box>
      <h1>{id}번 글 수정</h1>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={board.title} onChange={handleTitleChange} />
      </FormControl>

      <FormControl>
        <FormLabel>본문</FormLabel>
        <Textarea
          value={board.content}
          onChange={(e) => {
            updateBoard((draft) => {
              draft.content = e.target.value;
            });
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>이미지</FormLabel>
        <Input
          type="file"
          accept="image/*"
          multiple // 파일을 여러개 올릴 수 있게 해주는 prop
          onChange={(e) => setUploadFiles(e.target.files)}
        />
        <FormHelperText>
          한개 파일은 1MB 이내, 총 용량은 10MB 이내로 첨부하세요.
        </FormHelperText>
      </FormControl>

      <Button onClick={onOpen} colorScheme="blue">
        저장
      </Button>
      {/* 이전 경로는 navigate(-1) , 이전이전은 -2 */}
      <Button onClick={() => navigate(-1)}>취소</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>저장 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>저장 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleSubmit} colorScheme="blue">
              저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
