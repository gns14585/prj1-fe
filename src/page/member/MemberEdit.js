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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useImmer } from "use-immer";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function MemberEdit() {
  const [member, updateMember] = useImmer("");

  const navigate = useNavigate();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const toast = useToast();

  if (member === null) {
    return <Spinner />;
  }

  function handleSubmit() {
    axios.put("/api/member/edits", member).then(() => {
      toast({
        description: "회원정보 수정 되었습니다.",
        status: "success",
      });
    });
  }

  return (
    <Box>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input value={member.password} />
      </FormControl>

      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input value={member.email} />
      </FormControl>
      <Button colorScheme="blue" onClick={onOpen}>
        수정
      </Button>
      <Button onClick={() => navigate(-1)}>돌아가기</Button>

      {/* 수정 모달 */}
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
