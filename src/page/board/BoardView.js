import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider";
import { CommentContainer } from "../../component/CommentContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

function LikeContainer({ like, onClick }) {
  if (like == null) {
    return <Spinner />;
  }
  return (
    <Button variant="ghost" size="xl" onClick={onClick}>
      {/*<FontAwesomeIcon icon={faHeart} size="xl" />*/}
      {like.like && <Text>꽉찬 하트</Text>}
      {like.like || <Text>빈 하트</Text>}
      <Text>{like.countLike}</Text>
    </Button>
  );
}

export function BoardView() {
  const [board, setBoard] = useState(null);
  const [like, setLike] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useParams();
  const { hasAccess, isAdmin } = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data));
  }, []);

  // 좋아요 정보를 얻어오는 useEffect
  useEffect(() => {
    axios
      .get("/api/like/board/" + id)
      .then((response) => setLike(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  function handleDelete() {
    axios
      .delete("/api/board/remove/" + id)
      .then((response) => {
        toast({
          description: id + "번 게시물이 삭제되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => onClose());
  }

  function handleLike() {
    axios
      .post("/api/like", { boardId: board.id })
      .then((response) => setLike(response.data))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
  }

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Heading size="xl">{board.id}번 글 보기</Heading>
        <LikeContainer like={like} onClick={handleLike} />
      </Flex>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={board.title} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>본문</FormLabel>
        <Textarea value={board.content} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input value={board.nickName} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>작성일시</FormLabel>
        <Input value={board.inserted} readOnly />
      </FormControl>

      {(hasAccess(board.writer) || isAdmin()) && (
        <Box>
          <Button colorScheme="purple" onClick={() => navigate("/edit/" + id)}>
            수정
          </Button>
          <Button colorScheme="red" onClick={onOpen}>
            삭제
          </Button>
        </Box>
      )}

      {/* 삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <CommentContainer boardId={id} />
    </Box>
  );
}
