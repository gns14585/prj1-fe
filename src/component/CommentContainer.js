import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { LoginContext } from "./LoginProvider";

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button isDisabled={isSubmitting} onClick={handleSubmit}>
        쓰기
      </Button>
    </Box>
  );
}

function CommentList({ commentList, onDeleteModalOpen, isSubmitting }) {
  const { hasAccess } = useContext(LoginContext);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {/* map 반복문을 통해 해당 코드 실행 */}
          {commentList.map((comment) => (
            <Box key={comment.id}>
              <Flex justifyContent="space-between">
                {/* memberId 작성자 아이디 */}
                <Heading size="xs">{comment.memberId}</Heading>
                {/* inserted 댓글 작성 시간 */}
                <Text fontSize="xs">{comment.inserted}</Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                {/* 댓글 작성하고 엔터키 누를경우 한줄로 표시되는데, sx={{ whiteSpace: "pre-wrap" }} 작성하게되면 엔터키 누른만큼 표시됨 */}
                <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
                  {comment.comment}
                </Text>

                {hasAccess(comment.memberId) && (
                  <Button
                    isDisabled={isSubmitting}
                    // 댓글 comment id 번호 얻어오는법
                    onClick={() => onDeleteModalOpen(comment.id)}
                    size="xs"
                    colorScheme="red"
                  >
                    <DeleteIcon />
                  </Button>
                )}
              </Flex>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const { isOpen, onClose, onOpen } = useDisclosure();

  // const [id, setId] = useState(0);
  // useRef: 컴포넌트에서 임시로 값을 저장하는 용도로 사용 , useState대신 사용해도됨 둘이 비슷함
  const commentIdRef = useRef(0);

  const { isAuthenticated } = useContext(LoginContext);

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);

      axios
        .get("/api/comment/list?" + params)
        .then((response) => setCommentList(response.data));
    }
  }, [isSubmitting]);

  function handleDelete() {
    // 댓글 comment id 번호 얻어오는법
    // console.log(id + "번 댓글 삭제");
    // TODO : 모달, then, catch, finally

    setIsSubmitting(true);
    axios.delete("/api/comment/" + commentIdRef.current).finally(() => {
      setIsSubmitting(false);
      onClose();
    });
  }

  function handleSubmit(comment) {
    setIsSubmitting(true);

    axios
      .post("/api/comment/add", comment)
      .finally(() => setIsSubmitting(false));
  }

  function handleDeleteModalOpen(id) {
    // id를 어딘가 저장
    // setId(id)
    commentIdRef.current = id;
    // 모달 열기
    onOpen();
  }
  return (
    <Box>
      {isAuthenticated() && (
        <CommentForm
          boardId={boardId}
          isSubmittin={isSubmitting}
          onSubmit={handleSubmit}
        />
      )}
      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        commentList={commentList}
        onDeleteModalOpen={handleDeleteModalOpen}
      />

      {/* 삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="red"
            >
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
