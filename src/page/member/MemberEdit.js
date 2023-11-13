import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
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

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [nickNameAvailable, setNickNameAvailable] = useState(false);

  const toast = useToast();
  const [params] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure(); // 탈퇴 모달창에 대한 HOOK
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/member?" + params.toString()).then((response) => {
      setMember(response.data);
      setEmail(response.data.email);
      setNickName(response.data.nickName);
    });
  }, []);

  const id = params.get("id");

  // 기존 이메일과 같은지?
  let sameOriginEmail = false;
  let sameOriginEmail2 = false;

  if (member !== null) {
    sameOriginEmail = member.email === email;
  }

  if (member !== null) {
    sameOriginEmail2 = member.nickName === nickName;
  }

  let emailChecked = sameOriginEmail || emailAvailable;
  let nickNameChecked = sameOriginEmail2 || nickNameAvailable;

  // 암호가 없으면 기존 암호
  // 암호를 작성하면 새 암호, 암호확인 체크
  let passwordChecked = false;

  if (passwordCheck === password) {
    passwordChecked = true;
  }

  if (password.length === 0) {
    passwordChecked = true;
  }

  if (member === null) {
    return <Spinner />;
  }

  function handleEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setEmailAvailable(false);
        toast({
          description: "이미 사용 중인 email입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailAvailable(true);
          toast({
            description: "사용 가능한 email입니다.",
            status: "success",
          });
        }
      });
  }
  function handleNickNameCheck() {
    const params = new URLSearchParams();
    params.set("nickName", nickName);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setNickNameAvailable(false);
        toast({
          description: "이미 사용 중인 닉네임 입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setNickNameAvailable(true);
          toast({
            description: "사용 가능한 닉네임 입니다.",
            status: "success",
          });
        }
      });
  }

  function handleSubmit() {
    // put /api/member/edit
    // {id, password, email}

    axios
      .put("/api/member/edit", { id: member.id, password, email, nickName })
      .then(() => {
        toast({
          description: "회원정보가 수정되었습니다.",
          status: "success",
        });
        navigate("/member?" + params.toString());
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "수정 권한이 없습니다.",
            status: "error",
          });
        } else {
          toast({
            description: "수정중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => onClose());
  }

  return (
    <Box>
      <h1>{id}님 정보 수정</h1>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      {password.length > 0 && (
        <FormControl>
          <FormLabel>password 확인</FormLabel>
          <Input
            type="text"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </FormControl>
      )}

      <FormControl>
        <FormLabel>닉네임</FormLabel>
        <Flex>
          <Input
            type="text"
            value={nickName}
            onChange={(e) => {
              setNickName(e.target.value);
              setNickNameAvailable(false);
            }}
          />
          <Button isDisabled={nickNameChecked} onClick={handleNickNameCheck}>
            중복확인
          </Button>
        </Flex>
      </FormControl>

      {/*  email을 변경하면(작성시작) 중복확인 다시 하도록  */}
      {/*  기존 email과 같으면 중복확인 안해도됨 */}
      <FormControl>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailAvailable(false);
            }}
          />
          <Button isDisabled={emailChecked} onClick={handleEmailCheck}>
            중복확인
          </Button>
        </Flex>
      </FormControl>

      <Button
        isDisabled={!emailChecked || !passwordChecked || !nickNameChecked}
        colorScheme="blue"
        onClick={onOpen}
      >
        수정
      </Button>

      {/* 수정 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>수정 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleSubmit} colorScheme="red">
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
