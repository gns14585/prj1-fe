import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function MemberSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [idAvailable, setIdAvailable] = useState(false);

  // 암호가 다르거나, 입력하지 않았을경우 error로 인식되어서 입력해달라는 문구 추가
  let submitAvailable = true;

  if (!idAvailable) {
    submitAvailable = false;
  }

  if (password != passwordCheck) {
    submitAvailable = false;
  } else if (password.length === 0) {
    submitAvailable = false;
  }

  function handleSubmit() {
    axios
      .post("/api/member/signup", {
        id,
        password,
        email,
      })
      .then(() => console.log("good"))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
  }

  function handleIdCheck() {
    // 인코딩을 대신 해주는게 URLSearchParams();
    const searchParams = new URLSearchParams();
    searchParams.set("id", id);
    axios
      .get("/api/member/check?" + searchParams.toString())
      .then(() => {
        setIdAvailable(false);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setIdAvailable(true);
        }
      });
  }

  return (
    <Box>
      <h1>회원가입</h1>
      <FormControl isInvalid={!idAvailable}>
        <FormLabel>id</FormLabel>
        <Flex>
          <Input
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setIdAvailable(false);
            }}
          />
          <Button onClick={handleIdCheck}>중복확인</Button>
        </Flex>
        <FormErrorMessage>ID 중복체크를 해주세요.</FormErrorMessage>
      </FormControl>

      {/* 암호를 입력하지 않았을때를 알게해줌 isInvalid */}
      <FormControl isInvalid={password.length === 0}>
        <FormLabel>password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* 암호를 입력하지 않았을 때 나오는 문구 */}
        <FormErrorMessage>암호를 입력해주세요.</FormErrorMessage>
      </FormControl>

      {/* 암호가 동일하지 않았을때를 알게해줌 isInvalid */}
      <FormControl isInvalid={password != passwordCheck}>
        <FormLabel>password 확인</FormLabel>
        <Input
          type="password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        {/* 암호가 동일하지 않았을 때 나오는 문구 */}
        <FormErrorMessage>암호가 다릅니다.</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <Button
        isDisabled={!submitAvailable} // 암호가 다르거나 입력하지 않으면 가입버튼을 클릭 할 수 없게됨
        onClick={handleSubmit}
        colorScheme="blue"
      >
        가입
      </Button>
    </Box>
  );
}
